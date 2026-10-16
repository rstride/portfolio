---
id: HTB-2026-OVERWATCH
title: Overwatch
excerpt: "Overwatch combines a public software share, a stored SQL credential, DNS control over a linked server's destination, and a PowerShell injection in a local management service."
date: '2026-02-07'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - MEDIUM
  - DNS-POISONING
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

## Map the route before attacking it

The lab chain is **readable `software$` share → credential in `overwatch.exe` → MSSQL on 6520 → linked server `SQL07` → AD-integrated DNS record → stored remote SQL login captured → WinRM as `sqlmgmt` → WCF `KillProcess` → LocalSystem**. Each arrow requires a separate permission. In particular, the password captured from the linked server is an SQL authentication secret carried in the TDS login exchange; it is not an NTLM hash obtained by cracking.

The target belongs to `overwatch.htb`. `<LAB_IP>` and `<ATTACKER_IP>` mean addresses within the authorized lab, and secrets are deliberately omitted. Queries and snippets below are illustrative diagnostics, not transcripts of the blog author's session.

## Read the software and identify its intended connections

Port discovery shows SMB, WinRM, and an MSSQL listener on nonstandard TCP 6520. Test whether the `software$` share is readable without a domain account. Download the provided .NET executable to an analysis workstation, record its hash, and inspect it with a .NET decompiler. A connection string inside `overwatch.exe` supplies a SQL login. The application also contains the WCF service code that later becomes relevant. Keeping both discoveries together helps explain why the binary is more informative than a port scan, yet neither a decompiled password nor source code proves the remote service accepts it.

Authenticate to MSSQL on port 6520 with the recovered account and inspect the server context and links:

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
```

`SYSTEM_USER` describes the present SQL identity; `ORIGINAL_LOGIN()` identifies the principal that started the session. The link to `SQL07` matters because it initiates a connection from the database server to a hostname. A link definition alone does not show that the caller may use it or that its remote login has a valuable role. Check the mapping and RPC setting before a linked query. Microsoft documents [linked-server behavior](https://learn.microsoft.com/en-us/sql/relational-databases/linked-servers/linked-servers-database-engine).

## Why a DNS record exposes a password here

`SQL07` is not resolving normally in the lab. The initial SQL credential has permission to add a child object in the AD-integrated DNS zone. Creating an A record for the missing name and pointing it to a controlled listener changes where the SQL Server sends its next linked-server login. This is a second permission check: possessing SQL credentials does not automatically permit DNS writes. Confirm the zone ACL and the name that the linked server actually resolves. Test from the database context, since a workstation's DNS answer is not proof of what the SQL service will use.

An illustrative query after the DNS change is:

```sql
EXEC ('SELECT 1') AT [SQL07];
```

This requires `RPC OUT` and a usable login mapping. On this machine the link uses a **stored SQL authentication** login. The SQL Server sends a TDS `LOGIN7` packet to the address now associated with `SQL07`; the password field uses reversible obfuscation rather than transport confidentiality in this configuration. A compatible listener can decode the stored remote login and reveal the `sqlmgmt` credential. If the link instead used Windows integrated authentication, the listener would see a different authentication exchange; the result would not be a cleartext password. Check the actual protocol capture and server settings, including encryption, rather than treating a generic Responder log as proof of a plaintext credential. The [TDS protocol specification](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-tds/) provides the wire-format context.

Authenticate with the recovered `sqlmgmt` credential to WinRM and run `whoami /all` to confirm the account and groups. A credential capture is not host access until the separate WinRM login succeeds. If the link fails before sending traffic, look for DNS caching, wrong record scope, disabled RPC OUT, mapping errors, or a required encrypted connection. These cause different outcomes and need different fixes.

## Reach the WCF operation from the host

The decompiled .NET service exposes `KillProcess(string processName)` on port 8000. That port may listen on the host while the firewall prevents direct access from the workstation. After WinRM access, call it through `localhost`; first retrieve the WSDL to confirm the endpoint and operation name. The endpoint is `MonitorService`, while an internal class may be named `MonitoringService`. WSDL and service code together establish the request contract better than guessing a SOAP envelope.

The vulnerable method builds a PowerShell script by concatenating the caller's process name:

```csharp
string scriptContents = "Stop-Process -Name " + processName + " -Force";
pipeline.Commands.AddScript(scriptContents);
```

`AddScript` parses a complete script. A separator supplied inside `processName` changes PowerShell syntax rather than remaining a process name. A benign controlled test can ask the service to print its identity, then inspect the SOAP result. The lab's service runs as LocalSystem, and this check establishes code execution in that context. Adding `sqlmgmt` to the local Administrators group is a separate durable effect; an existing WinRM token does not instantly gain newly assigned group rights. Reauthentication may be needed to observe the new token. Microsoft documents [PowerShell's typed `AddCommand` API](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.powershell.addcommand).

A minimal lab-only SOAP diagnostic shows the input crossing into the PowerShell parser. Send it from the established host session to `localhost`, after confirming the WSDL and service identity:

```http
POST /MonitorService/ HTTP/1.1
Host: localhost:8000
Content-Type: text/xml; charset=utf-8
SOAPAction: "http://tempuri.org/IMonitoringService/KillProcess"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <KillProcess xmlns="http://tempuri.org/">
      <processName>x; whoami #</processName>
    </KillProcess>
  </s:Body>
</s:Envelope>
```

The `SOAPAction` selects the interface operation; the XML body supplies its string argument. In PowerShell, `;` ends the intended `Stop-Process` statement and `#` comments out the appended `-Force`. `whoami` is a low-impact identity probe. A `KillProcessResult` containing the service account establishes execution, whereas an HTTP 200 with an empty or fault body does not. This request depends on the lab's `tempuri.org` namespace and basic HTTP binding; derive those values from the actual WSDL in any other installation. The call belongs on the Windows host because the firewall blocks the workstation's direct connection.

If the WSDL is visible but calls fail, verify the `SOAPAction`, namespace, content type, method signature, and caller access. A 403 from the workstation may be a firewall rule while the same request from the established host session succeeds. A `Stop-Process` error may occur before or alongside injected syntax; examine the returned command output instead of treating every error as a failed proof.

The DNS step has its own provenance. The record is created in an AD-integrated zone using an ACL that allows a child object, while the SQL link supplies the exact hostname to resolve. Verify the record's fully qualified name, not only the short label: a suffix mismatch can redirect a workstation lookup while leaving the SQL host's link unchanged. When the listener sees a TDS login, associate it with the linked query's timing and source address before decoding the stored credential. That correlation is what distinguishes this route from ordinary background SQL traffic.

## Check the sequence of permissions

| Boundary | Evidence to collect | Why the next action is justified |
| --- | --- | --- |
| Share to SQL | A readable `software$` binary contains a connection string, then the SQL login succeeds on TCP 6520. | A decompiled secret is only a candidate until the database accepts it. |
| SQL to DNS | The `SQL07` link exists and the principal can create a child DNS record in the relevant AD zone. | Neither a linked-server definition nor SQL access alone confers control over its resolved address. |
| DNS to stored credential | The SQL host resolves `SQL07` to the controlled address, makes a linked call, and emits an SQL-auth TDS login. | A packet from some other host, or an NTLM exchange, would support a different conclusion. |
| Credential to host | `sqlmgmt` authenticates to WinRM and `whoami /all` identifies the token. | Decoding a stored password is not the same as an accepted host login. |
| Host to service | The localhost WSDL exposes `KillProcess`, and the diagnostic response reports LocalSystem. | Reaching port 8000 or receiving HTTP 200 does not by itself establish execution. |

Keep the DNS record name, TTL, listener address, and packet timestamps with the lab notes. DNS caching can make a corrected record appear ineffective; the SQL service's query and outbound connection are more authoritative than a lookup on the assessment workstation. For the final WCF call, record the SOAP fault or `KillProcessResult` as well as the service process identity. If a group is changed during the test, open a fresh WinRM session before evaluating membership because Windows access tokens are established at logon. These details turn a multi-service chain into reproducible permission checks instead of a sequence of unexplained tool outputs.

## Close the boundaries

Remove secrets from distributed binaries and rotate the recovered SQL credentials. Restrict share access and the initial SQL principal's rights to the minimum needed. Repair the dangling `SQL07` link, require protected transport for remote SQL authentication, and limit who can create DNS records in the zone. Check that a low-privilege account can neither redirect the linked server nor obtain its stored credentials.

Replace `AddScript` string construction with `AddCommand("Stop-Process")` and a typed `Name` parameter; still authorize callers and constrain which processes they may manage. Run the WCF service under a dedicated account with only necessary rights. Retest a legitimate process operation, a process name containing a separator, denied unauthenticated access, and the service process identity. Correlate DNS changes, linked-server calls, and WCF operations in logs: those events describe the chain more precisely than a generic alert on PowerShell execution.
