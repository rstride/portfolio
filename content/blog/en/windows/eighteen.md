---
id: HTB-2026-EIGHTEEN
title: Eighteen
excerpt: "Eighteen uses a SQL impersonation permission to reach a web password hash, then a delegated managed service account to cross an Active Directory privilege boundary."
date: '2025-11-15'
updated: "2026-10-15"
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

## Follow the identities

The lab supplies credentials for the local SQL login `kevin`. The path is **SQL login → impersonate `appdev` → read `financial_planner` → recover a web password → reuse it for domain user `adam.scott` → WinRM → create a dMSA in the Staff OU → BadSuccessor → privileged Kerberos ticket**. A SQL `EXECUTE AS` operation does not turn `kevin` into a Windows account. The later password reuse and WinRM login are separate transitions. The dMSA step depends on the domain controller's operating system, patch state, and object permissions.

The provided and recovered passwords, hashes, tickets, and flags are omitted. `eighteen.htb` denotes the authorized lab, and any tool named here must be reviewed at a recorded version before use.

## Use SQL impersonation to reach the data

Network enumeration shows MSSQL on 1433 along with the web service and WinRM. The supplied `kevin` credential is for SQL authentication; a domain-integrated attempt may fail even though the SQL login is valid. In an authenticated SQL session, enumerate databases and effective permissions:

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT name FROM sys.databases;
SELECT * FROM fn_my_permissions(NULL, 'SERVER');
```

The `financial_planner` database is visible but not accessible as `kevin`. Visibility is not authorization. A permission check shows `kevin` may impersonate `appdev`, the login used by the application. Switch context and repeat the identity and access tests:

```sql
EXECUTE AS LOGIN = 'appdev';
SELECT SYSTEM_USER AS effective_login, ORIGINAL_LOGIN() AS original_login;
USE financial_planner;
SELECT name FROM sys.tables;
REVERT;
```

`SYSTEM_USER` changes, while `ORIGINAL_LOGIN()` records the original connection. `REVERT` restores the previous SQL context. The ability to enter `financial_planner` as `appdev` shows the effect of impersonation, not a database bug in the web app. Microsoft documents [EXECUTE AS](https://learn.microsoft.com/en-us/sql/t-sql/statements/execute-as-transact-sql) and its scope.

The `users` table contains a Werkzeug `pbkdf2:sha256` password hash for the web administrator. Record the algorithm, iteration count, salt, and digest format before selecting an offline tool mode. The stored representation is not automatically identical to Hashcat's mode 10900 input; conversion must preserve bytes and encoding. Offline guessing tests candidate passwords without logging into the target. A recovered password must then be checked against the actual domain account. In the lab, the candidate also works for `adam.scott`, who can use WinRM. Confirm `whoami` and group membership in that host session; the web administrator and domain user are distinct principals sharing a secret.

If the SQL switch fails, inspect whether the grant is at login or database-user scope and whether `appdev` exists on the current instance. If the password guess works on the web site but not WinRM, check the domain name, account lockout, group authorization, and whether password reuse actually exists on the current snapshot.

## Understand the dMSA opportunity

`adam.scott` has rights to create suitable objects in the Staff organizational unit. A delegated Managed Service Account, or dMSA, is a Windows Server 2025 feature intended to support service-account migration. The BadSuccessor issue arises when a lower-privileged user can create or modify a dMSA and set migration-related attributes so it claims a high-privilege predecessor. The KDC may then issue tickets carrying authorization associated with that predecessor. The [original technical research](https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory) explains the mechanism.

Before any change, inventory the domain controllers and inspect the effective ACL on `OU=Staff,DC=eighteen,DC=htb`. A generic right to create a child is relevant only if it permits creating the required service-account object; an object-specific deny or a patched KDC can change the outcome. Confirm which controller processes the ticket request. These read-only checks are useful from a domain session with the ActiveDirectory module:

```powershell
Get-ADDomainController -Filter * | Select-Object HostName,OperatingSystem,OperatingSystemVersion
Get-Acl 'AD:OU=Staff,DC=eighteen,DC=htb' | Select-Object -ExpandProperty Access
```

The second command depends on an AD PowerShell drive and sufficient rights to read the security descriptor. It prints ACL entries, not the caller's computed effective access. Windows Server 2025 support is a prerequisite; SQL Server 2022 on the same host says nothing about the KDC feature.

A controlled dMSA test must record the creator's rights, newly created object, chosen predecessor, migration state, and whether the KDC accepts the relationship. The public lab route targets Administrator as predecessor and requests a ticket for the controlled dMSA. A ticket request, service-ticket request, and later directory replication are three distinct operations. A tool reporting successful object creation does not prove that the KDC granted privileged group membership. Verify the returned ticket's authorization in a controlled environment and an actual accepted service operation. Directory replication further requires effective replication rights; only a successful replication response establishes that impact.

## Patch-aware troubleshooting

The original one-sided predecessor relationship works only under the vulnerable servicing state. The [patch analysis for CVE-2025-53779](https://www.akamai.com/blog/security-research/badsuccessor-is-dead-analyzing-badsuccessor-patch) reports that updated KDCs reject it. A later path requires control over a mutual relationship, including the predecessor object, and is a different permission problem. Therefore, a failed one-sided ticket request on a patched DC is an expected defense, not necessarily a broken tool. Check exact cumulative updates, selected DC, AD replication state, object ACLs, Kerberos clock skew, realm, and SPN before drawing conclusions. Disabling RC4 alone does not remove an authorization flaw involving dMSA attributes.

## Repair and regression test

Patch every relevant domain controller and restrict creation and write permissions on OUs, dMSAs, and predecessor objects. Audit legitimate service migrations, because their attributes resemble the objects an attacker would try to manipulate. Rotate credentials recovered from the SQL database and eliminate reuse between web and domain accounts. Revisit `kevin`'s SQL impersonation permission and whether the application database exposes password material to `appdev` beyond its need.

A meaningful retest checks that `kevin` cannot read `financial_planner` through an unauthorized identity, the old reused password no longer opens WinRM, an unprivileged creator cannot obtain a ticket with predecessor privileges, and a legitimate migration still works. Record the object changes and the KDC that answered. Monitoring should correlate dMSA creation, migration-attribute writes, service tickets, and replication requests rather than treating every new service account as compromise.
