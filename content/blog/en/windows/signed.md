---
id: HTB-2025-011
title: Signed
excerpt: "MSSQL access and Kerberos service-ticket forgery: separating service-account compromise from unsupported domain-controller access claims."
date: '2025-10-11'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - MSSQL
  - KERBEROS
  - SILVER-TICKET
  - MEDIUM
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: MEDIUM
severity: MEDIUM
icon: ShieldAlert
author: '0x7CC'
---

## Supported chain and limits

The existing Signed account describes obtaining an MSSQL service-account credential, database command execution, and subsequent Kerberos ticket forgery. It does not supply the service-key extraction, account-to-SPN mapping, or a successful ticket-validation trace. Those gaps prevent a complete claim of Domain Admin access.

The important boundary is between compromising one service account and compromising another service's ticket key. An MSSQL account's NTLM hash is not automatically the key for CIFS on a domain controller. The original CIFS forgery command is omitted because its required key ownership was never established.

## Establish the database context first

The target is `signed.htb`, with MSSQL on TCP 1433. The account describes password spraying but does not provide its candidate set or authentication transcript. Treat valid credentials as the starting condition; do not infer domain-wide rights from a successful database login.

These read-only queries are illustrative checks inside an authenticated SQL session:

```sql
SELECT SYSTEM_USER AS login_name,
       IS_SRVROLEMEMBER('sysadmin') AS is_sysadmin;
SELECT name, value_in_use
FROM sys.configurations
WHERE name = 'xp_cmdshell';
```

They identify the current SQL login's server-role membership and the configured command-execution feature. They do not establish the Windows process identity, prove that the login may enable the feature, or extract a service-account secret. Record those facts separately. Microsoft documents [xp_cmdshell permissions and execution context](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).

## Understand the Silver Ticket prerequisites

A Silver Ticket is a forged service ticket. The attacker needs the target service's long-term key for a usable encryption type, the correct service principal and realm, and identity data accepted by the service. Validation of the authorization data and the deployment's hardening also matter.

Microsoft explains that a service ticket is protected with the server's key in its [session-ticket documentation](https://learn.microsoft.com/en-us/windows/win32/secauthn/session-tickets). Therefore, forging a ticket for an MSSQL SPN and forging a CIFS ticket are different claims unless the relevant SPNs use the same compromised account key.

An SPN inventory is necessary, but listing an SPN does not recover its key. Likewise, possessing a ticket does not show the server accepted it. A rigorous account would record the owning account, key provenance without exposing the key, chosen service, accepted authentication, and resulting permissions.

## Impact and remediation

Service-account compromise can expose database contents, permit database administration, or support OS execution according to the actual permissions. Domain-controller administration remains unproven in this account. Service-scoped authentication must not be described as universal domain elevation.

Use managed service accounts where supported, rotate compromised keys, reduce database and OS privileges, and remove unnecessary SPNs and command-execution permissions. Verify SPN ownership and approved encryption settings against the actual deployment; avoid treating one protocol setting as a complete fix.

After remediation, verify that the old credential no longer authenticates, application operations still work, and the service cannot perform administrative operations outside its remit. Collect service-side authentication and access logs. A forged service ticket may be used without a corresponding KDC issuance request, so KDC logs alone cannot demonstrate its absence.
