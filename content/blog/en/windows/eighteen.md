---
id: HTB-2026-EIGHTEEN
title: Eighteen
excerpt: "BadSuccessor on Windows Server 2025: separating account access, dMSA creation rights, inherited authorization, and patched KDC behavior."
date: '2025-11-15'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - EASY
  - DMSA
  - BADSUCCESSOR
  - KERBEROS-PAC
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: EASY
severity: LOW
icon: Terminal
author: '0x7CC'
---

## Chain and evidence

The Eighteen account reports credentials for `adam.scott`, access through WinRM, rights to create objects in a staff OU, and extraction of predecessor key material through a controlled delegated Managed Service Account (dMSA).

The authentication and ACL transcripts are incomplete. Its SMB login check does not itself prove WinRM authorization; its list of HTTP and SQL ports also omits the discovery needed to support that session. This article takes the later authenticated session as reported and focuses on the dMSA boundary.

## Enumerate effective rights and the servicing state

The [original BadSuccessor research](https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory) describes abuse of a controlled dMSA to inherit a predecessor's privileges. Creating a suitable dMSA can be possible through object-specific or broad child-creation rights on an OU. Windows Server 2025 domain-controller support is a prerequisite; the presence of SQL Server 2022 does not determine the DC version.

An illustrative read-only PowerShell inventory, with the ActiveDirectory module installed and an authorized domain connection, is:

```powershell
Get-ADDomainController -Filter * |
    Select-Object HostName, OperatingSystem, OperatingSystemVersion
```

It inventories reported DC versions. It does not establish their installed security updates or the caller's rights. Inspect effective OU/object ACLs and the servicing state of the DC that processes authentication separately.

## Separate directory changes, tickets, and keys

The original path depends on controlling a dMSA, setting its predecessor relationship and migration state, and meeting the requirements to request authentication as that dMSA. Creating an object alone does not complete all those steps.

The original article conflated privilege data in the Privilege Attribute Certificate (PAC) with predecessor keys returned through the dMSA key package. Privilege inheritance and key acquisition are different results. An RC4 key may correspond to an NT hash; that is not evidence that every key entry is an NTLM hash.

The lab reports predecessor key output but leaves the requesting machine identity and script setup unexplained. Its incomplete `getST.py` invocation and key value are removed. A reproducible account needs the tool version, requesting principal, dMSA access rights, DC selection, and evidence of acceptance, with secrets redacted.

## The patch changes the prerequisites

Akamai's [patch analysis for CVE-2025-53779](https://www.akamai.com/blog/security-research/badsuccessor-is-dead-analyzing-badsuccessor-patch) reports that a patched KDC rejects the original one-sided predecessor relationship. Its tested post-patch path requires a mutual relationship and control over the predecessor object as well. “Windows Server 2025” therefore does not imply that the original escalation works.

Do not present disabling RC4 as a complete fix: preventing one key representation does not address unauthorized inheritance of privileges. Likewise, a reported DCSync step requires replication permissions in the resulting context and its own evidence; it is not demonstrated by displaying predecessor keys.

## Remediation, detection, and retest

Install the applicable DC security updates and narrow OU, dMSA, and predecessor-object write permissions. Review who can create managed service accounts and who can retrieve or use their credentials.

In an isolated directory test, verify that an unprivileged creator cannot authenticate through the old one-sided relationship; also check that unauthorized mutual-link changes fail. Preserve legitimate service migrations as a positive control.

With appropriate audit policy and object SACLs, inspect dMSA creation and migration-link modifications on both sides, correlating actor, object, and authentication. Confirm the actual changed object rather than searching only for edits to Administrator. The central lesson is that a new object can influence authorization for an existing principal, and that the patch state determines the attack's starting conditions.
