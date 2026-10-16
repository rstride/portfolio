---
id: HTB-2026-DARKZERO
title: DarkZero
excerpt: "DarkZero crosses three different boundaries: a linked SQL login in another forest, local Windows privilege elevation, and Kerberos delegation across a specially configured forest trust."
date: '2025-10-04'
updated: "2026-10-15"
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

## Starting position

DarkZero is an assume-breach lab. The scenario supplies valid credentials for `john.w` in `darkzero.htb`. The intended sequence is **SQL on DC01 → mapped link to DC02 in `darkzero.ext` → remote SQL `sysadmin` → OS execution as `svc_sql` → SYSTEM on DC02 → delegated TGT from DC01 → directory replication against `darkzero.htb`**. The last step depends on trust configuration and a captured domain-controller ticket; merely becoming SYSTEM on DC02 does not compromise the first forest.

Credentials, ticket blobs, and flag values are omitted. `DC01.darkzero.htb` and `DC02.darkzero.ext` are distinct hosts in distinct forests. Run examples only in the authorized lab and record which host and security principal produced each result.

## Follow the linked server into the other forest

First confirm that the supplied account authenticates to MSSQL on DC01 and inspect the available links and mappings. The link is named `DC02.darkzero.ext`; use that exact name in linked queries. These queries are read-only diagnostics in the first SQL session:

```sql
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
EXEC ('SELECT SYSTEM_USER AS remote_login,
       IS_SRVROLEMEMBER(''sysadmin'') AS is_sysadmin') AT [DC02.darkzero.ext];
```

The remote query requires RPC OUT and a usable login mapping. In this lab, `john.w` is mapped to `dc01_sql_svc` on DC02, and the remote identity has `sysadmin`. A linked server is a way to ask another SQL instance to perform work. The resulting rights belong to the **remote SQL login**, not automatically to `john.w` in Active Directory. Microsoft documents the [login mappings](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addlinkedsrvlogin-transact-sql) that make this transition possible.

As remote SQL `sysadmin`, the caller can enable `xp_cmdshell` on DC02 if the feature is disabled. A controlled `whoami` call then reveals `darkzero-ext\svc_sql` as the OS execution identity. The role check and the identity check answer different questions: one establishes SQL authorization, the other shows whose Windows token launches the process. `svc_sql` is not SYSTEM. SQL Server's [xp_cmdshell documentation](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql) explains why the service-account context matters.

If the linked query fails, inspect the exact link name, `is_rpc_out_enabled`, remote mapping, Kerberos/SQL authentication choice, and whether DC02 is reachable from DC01. Successful login to DC01 does not guarantee any of these conditions.

## Establish local control on DC02

The laboratory offers more than one local path from `svc_sql` to SYSTEM. One documented route uses CVE-2024-30088 after confirming the affected Windows build and patch state. The [Microsoft security entry](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30088) is the authority for the fix. A supported replay must identify the exact build, cumulative update, architecture, and chosen proof of concept. Windows Server 2022 alone does not determine vulnerability. Another path relies on service-logon rights and token behavior, which has different prerequisites. Mixing their commands would make the chain impossible to follow; this walkthrough treats either as a separately verified means of obtaining SYSTEM.

The token route starts with a different observation from the kernel-CVE route. Inspect the effective token with `whoami /all` and the exported local user-rights assignment for `SeServiceLogonRight`. In this lab, `svc_sql` is permitted a service logon, while the current interactive or network logon does not expose the impersonation privilege needed by a named-pipe technique. Starting a controlled process through the service-logon path can yield a token with `SeImpersonatePrivilege`; only then does a named-pipe impersonation test become relevant. The presence of a right in policy is not equivalent to the privilege being enabled in the current process. Check the new token before attempting that route, and verify SYSTEM afterward. This path is conceptually separate from CVE-2024-30088 and should be retested through its own logon policy and token checks.

Run `whoami /all` after a local elevation to confirm the token and privileges. A shell prompt, service-account password, or successful exploit message is weaker evidence than the actual token. Administrative changes on DC02 affect `darkzero.ext` first; they do not grant authority in `darkzero.htb` through SID filtering or through the linked SQL account.

## Verify the forest trust and delegated ticket

The cross-forest step requires a bidirectional forest trust that permits TGT delegation. In the lab the trust carries `CROSS_ORGANIZATION_ENABLE_TGT_DELEGATION`, while SID filtering is also enabled. These settings have different roles: delegation permits a forwarded TGT to reach a service in the other forest; SID filtering constrains authorization data traversing the trust. A generic statement that "a trust exists" is insufficient. Check the actual trust attributes and delegation configuration before expecting a ticket to arrive. Microsoft's [trust attribute specification](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/) gives the protocol context.

With SYSTEM on DC02, inspect the tickets cached for the host. Existing `darkzero.ext` tickets do not establish control of `darkzero.htb`. The useful ticket is a forwarded TGT belonging to `DC01$` from the **first** forest. The lab path waits for that ticket, then triggers an authenticated request from DC01 to a service on DC02, for example by having DC01's SQL service access a UNC path on DC02 through `xp_dirtree`. The coercion must be invoked in the DC01 SQL context, not on the remote linked server. Verify the source host, principal, trust flags, destination service, and forwarded ticket identity in the resulting trace.

A captured `DC01$` TGT can be used to request service tickets as that domain-controller machine account. Domain controllers commonly possess replication rights, so a directory replication request against `darkzero.htb` can expose its account secrets. This is a further permission check: a ticket file by itself is not proof of replication access. The result must include accepted Kerberos authentication to the correct forest and a successful directory response. Time skew, wrong realm or SPN, and routing through the cross-forest pivot can all break this stage. The lab's documented path reaches DC01 administration only after these checks.

There are three Kerberos identities to keep apart in this stage: the user who started the SQL session, the SQL service account whose process issues the network request, and the DC01 machine principal represented in the forwarded ticket. A successful UNC lookup shows only that the server attempted network authentication. It does not tell which ticket was delegated. Inspect both the client principal and the ticket's target service in the DC02 cache. A cross-realm referral ticket and a forwarded TGT have different uses; the final replication request needs credentials usable as `DC01$` in `darkzero.htb`. This is also why the trust attributes matter more than the mere existence of a two-way trust. When documenting a replay, include the direction of the request and which DC handled the final directory operation. Those details make it possible to distinguish a real forest crossing from administration confined to DC02.

## Prove the forest crossing rather than infer it

| Stage | Verify | What remains unproven |
| --- | --- | --- |
| Linked SQL query | The remote result reports `dc01_sql_svc` and `sysadmin` on DC02. | It says nothing about `john.w`'s Windows rights in either forest. |
| OS command on DC02 | `whoami` reports `darkzero-ext\svc_sql`. | This is not SYSTEM and is not a domain-controller credential. |
| Local elevation | `whoami /all` reports SYSTEM and the expected privileges on DC02. | SYSTEM on the second forest does not bypass the trust boundary by itself. |
| Delegation | The trust attributes allow TGT delegation and the target service receives a forwarded `DC01$` TGT. | A generic Kerberos service ticket or a `darkzero.ext` TGT is not the required credential. |
| Replication | Authentication with the captured DC01 machine account is accepted by a directory service in `darkzero.htb`, and the requested replication operation succeeds. | A ticket file on disk alone does not establish directory access. |

The ordering prevents an easy category error. `xp_dirtree` on DC01 can coerce DC01's service context to request a network resource on DC02, but a network connection is only the beginning. The forwarding behavior depends on the trust's delegation flag, service account and SPN selection, and the receiving service. Inspect the ticket cache on DC02 after the request and identify the client principal and realm rather than assuming every new ticket is useful. If nothing appears, check whether the request ran on DC01, whether the cross-forest service ticket was forwardable, clock alignment, and network reachability. If a `DC01$` ticket appears but replication fails, investigate its accepted authentication and directory rights separately. This is why the final outcome cannot be inferred from a successful SQL command or a SYSTEM prompt on DC02.

## Repair and retest

Remove excessive linked-server mappings, disable RPC OUT where unnecessary, and avoid mapping an ordinary caller to a remote SQL administrator. Keep `xp_cmdshell` disabled unless a reviewed operation requires it, and run SQL services with minimal OS rights. Patch DC02 using the applicable Windows cumulative update, then confirm the installed build rather than relying on a product name.

Review forest trust settings and disable cross-forest TGT delegation if no approved workflow needs it. Retain SID filtering, restrict coercible authentication paths, and monitor trust changes, linked-server execution, unexpected outbound SMB, delegated ticket use, and replication requests. In a retest, `john.w` must not acquire remote SQL administration, the SQL process must not run privileged commands, a low-privilege caller must not obtain SYSTEM, and DC01's ticket must not be forwarded to an unapproved host. Test each condition independently so one fixed step does not hide another exposed boundary.
