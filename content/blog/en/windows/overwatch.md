---
id: HTB-2026-OVERWATCH
title: Overwatch
excerpt: "Public tooling exposes SQL credentials; linked-server authentication and a WCF script-concatenation flaw illustrate two distinct trust boundaries."
date: '2026-02-07'
updated: "2026-10-13"
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

## Chain and evidence limits

The existing Overwatch account describes a readable SMB share `software$`, credentials recovered from `overwatch.exe`, access to SQL on port 6520, and a WCF management service on port 8000. It reports a later session as `sqlmgmt` and abuse of `KillProcess` to gain administrative rights.

The middle step needs qualification: the account does not explain how a linked-server query was directed to the capture listener or how captured authentication became the password used for WinRM. Those are required steps, not consequences of running Responder alone.

## Credentials and outbound authentication

Reading a shared executable or its configuration can reveal a connection string. Possession of the resulting SQL credential supports a database login only if the server accepts it; it does not yet establish OS access.

The retained query illustrates the operation described in the account:

```sql
EXEC ('SELECT 1') AT [SQL07];
```

`SQL07` is the recorded linked-server name. The statement requires a suitable mapping and RPC OUT. Outbound authentication depends on the actual destination, protocol, and authentication configuration. Microsoft explains [linked-server execution](https://learn.microsoft.com/en-us/sql/relational-databases/linked-servers/linked-servers-database-engine); the query itself does not demonstrate attacker control of its destination.

NTLM capture normally obtains challenge-response material, not a plaintext password or the account's raw NT hash. Offline recovery requires password guessing; relay requires a compatible accepting service and its own security prerequisites. These are separate branches. See [Microsoft's NTLM protocol overview](https://learn.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm). The account reports working `sqlmgmt` credentials but leaves their derivation unproven.

## WCF input becomes PowerShell code

With the later host access taken as a recorded condition, the account provides this vulnerable implementation excerpt:

```csharp
string scriptContents = "Stop-Process -Name " + processName + " -Force";
pipeline.Commands.AddScript(scriptContents);
```

The untrusted process name is parsed as part of a script. A separator can introduce another statement rather than identify a process. Exploitation also requires reachability of the method, acceptable authentication, and a privileged service identity.

The account reports execution as LocalSystem and a change to local Administrators membership. Adding membership is not the same observation as receiving a SYSTEM shell; a new login token must acquire the relevant rights. The complete service contract and request are absent, so the original proxy invocation is not presented as a verified replay.

## Correct the operation, then retest

Use typed commands and parameters instead of script concatenation. This illustrative replacement still needs application-specific authorization and process-selection rules:

```csharp
using var ps = System.Management.Automation.PowerShell.Create();
ps.AddCommand("Stop-Process")
  .AddParameter("Name", processName)
  .AddParameter("Force");
ps.Invoke();
```

[PowerShell's AddCommand API](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.powershell.addcommand) separates the command from its parameters. Parameterization removes this parsing boundary; it does not authorize killing arbitrary processes.

Rotate exposed SQL credentials, remove them from distributed binaries, restrict share access and SQL egress, and run the management service with only necessary rights. In a test environment, send a name containing a separator and assert that it cannot launch a second operation. Verify that unauthorized callers are denied and approved process management still works.

Monitor outbound database authentication, management-service operations, and local group changes. Correlate them with caller identity; do not describe all captured NTLM material as a recovered password.
