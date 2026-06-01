---
id: HTB-2026-DARKZERO
title: DarkZero
excerpt: Offensive security write-up.
date: '2025-10-04'
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

# Hack The Box — DarkZero (Windows) Write-Up: Cross-Forest Trust → Linked MSSQL RCE → CVE-2024-30088 LPE → TGT Delegation

## TL;DR
On **DarkZero**, we perform an assume-breach Active Directory attack starting with low-privileged credentials. We connect to the primary forest's database server, discover a linked server mapping to the remote forest with sysadmin rights, and exploit it to achieve code execution. Privilege escalation to SYSTEM is achieved via CVE-2024-30088, and domain compromise is reached by exploiting cross-forest TGT delegation.

---

## Target
- Host: `darkzero.htb` / `darkzero-ext`
- IP: `10.129.4.91`

---

## Recon: Assume-breach credentials and SQL Link discovery

We start with valid domain user credentials:
- Username: `john.w`
- Password: `provided_password`

We run an active scan and connect to the local MSSQL database instance on `DC01`. Checking for linked servers reveals a database link:
- Link name: `SQL07`
- Target server: `DC02` (in the `darkzero.ext` domain)
- Mapped context: `sysadmin`

---

## Initial Foothold: Linked Server Command Execution

Because the mapped linked server account has sysadmin rights on `DC02`, we can execute administrative store procedures on the remote database. We enable `xp_cmdshell` via the linked context:

```sql
EXEC ('sp_configure ''show advanced options'', 1; reconfigure;') AT [SQL07];
EXEC ('sp_configure ''xp_cmdshell'', 1; reconfigure;') AT [SQL07];
```

We execute arbitrary PowerShell commands to run a Metasploit stager. This spawns a reverse shell session as `darkzero-ext\svc_sql` on the remote database server `DC02`.

---

## Privilege Escalation: Windows Kernel LPE (CVE-2024-30088)

Once on the target, local enumeration reveals the OS version is Windows Server 2022. It is vulnerable to CVE-2024-30088, a local privilege escalation flaw in the Windows Authz component.

We run the Metasploit exploit module:

```text
msf > use exploit/windows/local/cve_2024_30088_authz_basep
msf exploit(windows/local/cve_2024_30088_authz_basep) > set SESSION 6
msf exploit(windows/local/cve_2024_30088_authz_basep) > run
```

The exploit successfully steals a Winlogon system token and opens a shell as `NT AUTHORITY\SYSTEM`. We dump the local SAM database and obtain the administrator's NTLM hash.

---

## Defensive notes / remediation

### Fix
- Audit linked server configurations and avoid mapping links to remote systems with elevated security privileges.
- Restrict execution of `xp_cmdshell` and disable advanced server features.
- Install security patches for CVE-2024-30088 to prevent local privilege escalation.

### Monitoring / detection ideas
- Alert on execution of `xp_cmdshell` commands, especially through linked server queries.
- Monitor execution of unexpected processes originating from database services.

---

## Lessons learned
- Cross-forest trusts and linked database servers are common avenues for lateral movement.
- Keeping systems updated against critical local privilege escalation flaws (CVE-2024-30088) is vital.

---

## Appendix: Timeline summary
1. Recon -> Log in with provided user, scan linked databases.
2. Foothold -> Execute remote queries on linked server to enable `xp_cmdshell` and get shell as `svc_sql`.
3. Privilege Escalation -> Exploit CVE-2024-30088 to elevate to `SYSTEM`.
4. Compromise -> Recover NTLM hashes and exploit cross-forest trust.

---
