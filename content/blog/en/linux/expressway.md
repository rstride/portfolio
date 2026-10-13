---
id: HTB-2025-002
title: Expressway
excerpt: "IKE Aggressive Mode exposes offline guessing material; credential reuse leads to SSH and an independently vulnerable sudo build."
date: '2025-09-20'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - EASY
  - VPN
  - IPSEC
  - IKE
  - PRIVESC
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: EASY
severity: HIGH
icon: Terminal
author: '0x7CC'
---

## Chain and evidence

Expressway's existing lab account reports an IKE Aggressive Mode exchange, recovery of a pre-shared key (PSK), reuse as the SSH password for `ike`, and local elevation through CVE-2025-32463. Its useful lesson is the separation of protocol exposure, weak-secret recovery, and credential reuse.

The original transcript contains neither the complete handshake nor the cracking command. The recovered secret and flag value are omitted; the mechanics below do not replace those missing captures.

## Follow the UDP surface

The recorded hostname is `expressway.htb`; the account lists UDP 500, 4500, and 69. As the [Nmap UDP scanning guide](https://nmap.org/book/scan-methods-udp-scan.html) explains, UDP scanning can produce ambiguous states, so an `open|filtered` result requires a protocol response before identifying a service. The presence of TFTP does not establish a configuration leak.

For an authorized diagnostic scan, this illustrative command limits discovery to the recorded ports:

```bash
sudo nmap -sU -sV -p 500,4500,69 expressway.htb
```

It requests UDP service identification; it does not authenticate to the VPN or recover a secret. Record the responding protocol and scan conditions instead of treating all UDP silence as confirmation.

## Aggressive Mode and the offline test

The account reports identity `ike@expressway.htb` with PSK authentication. IKEv1 Aggressive Mode exchanges allow capture of values against which password guesses can be checked offline. The protocol construction is described in [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.html). An identity string can guide account discovery; it is not an SSH credential.

Offline recovery still depends on the PSK's resistance to guessing and a correctly captured exchange. The account reports that the recovered PSK also authenticated the `ike` SSH account. That reuse is an additional configuration weakness: recovering a VPN PSK does not inherently grant SSH access.

## Identify the sudo actually executed

After SSH access, the account records sudo 1.9.17 and a SUID binary under `/usr/local/bin`. These illustrative local checks distinguish the custom binary from the package-managed one:

```bash
command -v sudo
/usr/local/bin/sudo --version
ls -l /usr/local/bin/sudo
```

They identify resolution, reported version, and permissions. They do not show whether a distribution backport is present or prove an exploit succeeded.

CVE-2025-32463 involves sudo using attacker-controlled NSS configuration during chroot handling. The original research identifies affected upstream versions 1.9.14–1.9.17 and the fix in 1.9.17p1. The path does not require a sudoers rule granting the user a command. See [Stratascale's disclosure](https://www.stratascale.com/resource/cve-2025-32463-sudo-chroot-elevation-of-privilege/).

The existing account reports root execution, but the pasted exploit does not explicitly select the custom binary. This revision removes that ambiguous script and retains the need to establish the exact vulnerable executable, architecture, and environment.

## Remediation and closure

Migrate away from IKEv1 Aggressive Mode where feasible, use strong independent credentials, and rotate the recovered PSK and reused password. Verify the legacy exchange is unavailable and that old credentials fail while approved VPN and SSH access still works.

Install the supported sudo security update and inventory every privileged copy, including `/usr/local/bin`. For custom builds, use a fixed upstream release or retire the build. Verify resolution and package provenance after the update; upgrading `/usr/bin/sudo` does not repair a separate SUID copy.

Monitor repeated IKE negotiations, SSH access associated with VPN identities, and privileged execution involving unusual chroot paths. Offline guessing does not produce a stream of online login failures, so that telemetry cannot measure whether a captured PSK was recovered.
