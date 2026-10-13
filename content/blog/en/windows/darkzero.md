---
id: HTB-2026-DARKZERO
title: DarkZero
excerpt: "Following a linked MSSQL login into Windows execution and local SYSTEM elevation, with explicit limits on the cross-forest compromise claim."
date: '2025-10-04'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - HARD
  - CROSS-FOREST
  - MSSQL-LINK
  - CVE-2024-30088
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: HARD
severity: HIGH
icon: Terminal
author: '0x7CC'
---

## Chain and starting conditions

DarkZero is an assume-breach lab: valid credentials for `john.w` are supplied at the start. The existing account describes a link named `SQL07` from the first forest to `DC02` in the second, SQL administration through that link, execution as `svc_sql`, and local elevation to SYSTEM.

It also claims cross-forest TGT delegation and forest compromise without documenting the required trust settings, delegated ticket, or final authentication. Those outcomes are not established here. The supported subject is the database trust boundary followed by local Windows elevation.

## Enumerate the remote login, not just the link

In an authenticated SQL session, these illustrative read-only queries identify the link and the remote SQL context:

```sql
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
EXEC ('SELECT SYSTEM_USER AS login_name,
       IS_SRVROLEMEMBER(''sysadmin'') AS is_sysadmin;') AT [SQL07];
```

`SQL07` is the link name recorded in the lab. The second query requires RPC OUT and a usable login mapping; failure does not prove the remote database is inaccessible through every linked-query mechanism. Record the local login, mapping, remote login, and remote role result.

A cross-forest connection need not use delegated Windows credentials: it can use a fixed remote login. The [Microsoft login-mapping documentation](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addlinkedsrvlogin-transact-sql) is the relevant reference. A link's existence alone does not establish administrative rights.

## From SQL rights to Windows execution

The account describes enabling `xp_cmdshell` remotely and receiving execution as `darkzero-ext\svc_sql`. This crosses from database permissions into the OS service context. SQL `sysadmin` and Windows SYSTEM are distinct privileges.

Where command execution is already enabled and authorized, an illustrative identity check is:

```sql
EXEC ('EXEC master..xp_cmdshell ''whoami'';') AT [SQL07];
```

This checks the Windows identity rather than inferring it from the SQL login. Microsoft documents the [service-account and proxy contexts of xp_cmdshell](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql). The original account does not include the full stager invocation; this article does not supply an invented transcript.

## Local elevation and the domain boundary

The lab reports elevation through CVE-2024-30088. Verify the exact Windows build, installed cumulative updates, architecture, and exploit prerequisites; “Windows Server 2022” alone is not a vulnerability determination. The patch reference is the [Microsoft security update entry](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30088).

The account reports `NT AUTHORITY\SYSTEM`. It does not establish a subsequent forest-wide operation. Its mention of a local SAM dump on a host called `DC02` also requires clarification: domain account secrets and an ordinary member server's local SAM are different evidence sources.

## Remediation and closure checks

Remove broad linked-login mappings and permit only the remote operations the application requires. Restrict RPC OUT where unnecessary. Run SQL under a dedicated least-privileged account, disable unnecessary OS execution, and patch the actual Windows build.

Verify that the original low-privileged login cannot reach remote administrative context, while legitimate linked queries still work. Test local and remote SQL contexts separately. Confirm the installed update after reboot. Review forest trust and delegation configuration as a separate assessment rather than treating patching as proof of trust isolation.

Monitor remote login mappings, configuration changes enabling command execution, and unexpected children of SQL Server. Correlating the SQL session with the remote Windows process explains the path more reliably than a shell screenshot alone.
