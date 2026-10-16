---
id: HTB-2026-SOULMATE
title: Soulmate
excerpt: "Soulmate moves from a file-transfer application to a web shell, an ordinary SSH account, and finally a root-run Erlang service. The important skill is checking the identity at every step."
date: '2025-09-06'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - CONFIG-LEAK
  - ERLANG
  - PORT-TUNNELING
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## Route through the machine

The useful chain is **virtual-host discovery → CrushFTP account control → PHP execution as `www-data` → exposed `ben` password → SSH → Erlang SSH service on loopback → root commands**. The public web page alone is a distraction; the file-transfer virtual host is the relevant surface. The Erlang service is local to the machine, so the SSH foothold supplies reachability.

These steps describe the authorized Soulmate lab. `<LAB_IP>` is the target address and `<LAB_PASSWORD>` means a credential recovered inside that lab. Neither is a literal value to paste. A command marked illustrative demonstrates a verification method; it is not a transcript from this site author's session.

## Discover the other HTTP host

A TCP scan shows SSH and HTTP. Browsing `soulmate.htb` reveals the public application, but a virtual-host check also finds `ftp.soulmate.htb`, which serves CrushFTP. Both names can resolve to the same lab IP while selecting different applications through the HTTP `Host` header. If a browser cannot reach `ftp.soulmate.htb`, add the lab IP and both names to the workstation's hosts file. Do not interpret a generic response from the bare IP as evidence that the FTP application is absent.

CrushFTP's web UI and version provide a research lead. CVE-2025-31161 affects the authentication boundary in vulnerable CrushFTP builds: a specially formed request can gain an administrative session and create or alter users. Confirm the actual version and patch state before invoking a public proof of concept. The [vendor's security information](https://www.crushftp.com/crush11wiki/Wiki.jsp?page=Security) is a better place to check fixed releases than a screenshot of a login page. A public [proof of concept for CVE-2025-31161](https://github.com/0xgh057r3c0n/CVE-2025-31161) documents the account-creation route; review its requests and arguments before using it in the lab. The useful evidence after running it is a newly controlled account that can authenticate to CrushFTP, not merely an HTTP success code.

The tool's documented invocation, from a reviewed local checkout on the assessment workstation, has this shape:

```bash
python3 CVE-2025-31161.py \
  --target_host ftp.soulmate.htb --port 80 \
  --new_user <NEW_USER> --password <NEW_PASSWORD>
```

`<NEW_USER>` and `<NEW_PASSWORD>` are fresh values for the lab account; avoid putting a real reusable password into shell history. `--target_host` names the CrushFTP virtual host and `--port 80` selects its HTTP listener, not the Unix SSH service. The result to verify is a new interactive CrushFTP login with the chosen values and a visible filesystem mapping. A console message saying that a user was created could be stale or misleading if the request reached a patched server. If the login fails, inspect the tool's HTTP response, configured administrative username, and vendor patch level before attempting file upload. This check turns an exploit claim into a specific application permission that can be tested independently.

The controlled file-transfer account needs write access to a directory that the separate web server serves as PHP. Enumerate its virtual filesystem mapping and test a harmless text upload first. The destination and its public URL are two different paths: one names a writable server directory; the other asks the web server to process a file at that directory. Uploading a PHP script is only code execution if the web server maps that path and runs PHP there. In the lab, that bridge yields execution under `www-data`. Verify with a temporary identity check, and remove the diagnostic file afterward. A browser displaying PHP source or returning 404 means the bridge failed; investigate mapping and permissions before assuming the payload is wrong.

## Locate the credential pivot

The `www-data` foothold can inspect local processes and readable application files. This read-only inventory helps separate visible services from assumptions:

```bash
id
ss -ltn
ps -eo user,pid,args | grep -E 'erl|ssh_runner' | grep -v grep
ls -l /usr/local/lib/erlang_login/start.escript
```

The `ps` output identifies a root-owned Erlang launcher and the listener shows a service bound to `127.0.0.1:2222`. The launcher is a local filesystem path, not an HTTP URL. Reading it requires the permissions of the current shell. Its configuration contains a credential for `ben`; the value is omitted here. A password in a daemon configuration does not necessarily belong to a Unix account, so first check which service accepts it. On this machine it is reused for the ordinary SSH login. Run `id` after authentication to confirm the new OS identity.

A loopback listener is reachable only from the host itself or through an authenticated tunnel. It is still exposed to local users. The Erlang service also performs its own authentication, so forwarding a port does not bypass its login check.

## Verify the privileged Erlang boundary

From the workstation, with an established `ben` SSH credential, an illustrative forward makes the target's loopback port available locally:

```bash
ssh -N -L 127.0.0.1:9999:127.0.0.1:2222 ben@soulmate.htb
```

Leave this session open and connect in a second terminal with `ssh -p 9999 ben@127.0.0.1`. The first `127.0.0.1` names the workstation listener; the second, after the final colon, names the destination as seen from Soulmate. If port 9999 is occupied, choose another local port. If the inner login rejects the password, verify the configured Erlang user and the credential independently from the outer SSH connection.

The lab's Erlang shell permits evaluation of `os:cmd/1`, which launches an operating-system command. A minimal identity test is:

```erlang
os:cmd("id").
```

Erlang statements end with a period. The returned identity is root because the SSH daemon is running as root. The login name `ben` used by the Erlang service does not force the child process to run as the Unix `ben` account; that mapping depends on how the daemon starts its shell. The [Erlang SSH documentation](https://www.erlang.org/doc/apps/ssh/ssh.html) describes daemon user authentication and shell configuration. This root result is a property of the machine's service design, not a general consequence of using Erlang.

Some walkthroughs mention the separate Erlang SSH vulnerability CVE-2025-32433, which allows a pre-authentication path under specific versions. This article follows the credential-and-shell path established for Soulmate. Do not combine those two paths or present a successful authenticated shell as proof of the CVE.

A successful SSH handshake to the forwarded port proves reachability of the Erlang daemon, not authentication. Its prompt can resemble an ordinary shell while interpreting Erlang expressions instead of Bash commands. Test with a harmless expression first; a trailing period is required by the Erlang shell grammar. Then use `os:cmd("id").` to inspect the child process identity. If the result is root, attribute it to the daemon's process context and shell callback, not to the account name supplied during SSH authentication. This distinction is central to the escalation and to the fix: changing the Unix password alone does not make a root-run management shell safe.

## Keep the identities separate

| Boundary | Check | What the result establishes |
| --- | --- | --- |
| HTTP routing | Request both `soulmate.htb` and `ftp.soulmate.htb` with the intended `Host` header. | A CrushFTP page on the second name establishes a distinct attack surface, even if both resolve to one IP. |
| CrushFTP account | Sign in with the newly chosen account and inspect its virtual filesystem. | The bypass produced usable application control and reveals where uploads will land. |
| Web execution | Fetch a temporary PHP identity diagnostic from the mapped URL. | Output from `id` or its equivalent establishes the web server's OS identity; an upload response alone establishes only a write. |
| Unix login | Open a new SSH session as `ben` and run `id`. | The credential read from configuration is also accepted by Unix SSH. This is a separate service and permission. |
| Erlang shell | Connect through the forward and run `os:cmd("id").`. | The local daemon executes commands with its own root process token; the outer `ben` login is merely a route to it. |

These checks should be recorded with host, port, identity, and time. A delayed callback or a browser tab that remains logged in can make a later stage appear to have succeeded under the wrong account. The safest interpretation comes from a fresh authentication and an identity check at each boundary. If only the Erlang port is reachable but its authentication fails, the tunnel works; investigate the service credential instead of changing the forwarding command.

## Failure checks and remediation

If the public site appears to be the only service, repeat virtual-host discovery and check HTTP routing. If account creation works but an uploaded PHP file does not execute, inspect the file-transfer virtual filesystem, effective write permissions, target URL, and PHP handler. If the `ben` password works in one SSH service but not the other, compare the two services' independent user databases. If the Erlang identity is unprivileged, verify the daemon process and service unit; a banner alone says nothing about its OS rights.

Upgrade CrushFTP to a vendor-fixed build, remove unneeded administrative functions from exposed interfaces, and monitor creation or password changes of transfer users. Keep upload destinations outside web-executable paths and configure the web server to treat uploaded content as data. Remove passwords from readable scripts, use separate credentials for Unix and management services, and rotate any disclosed value. Run the Erlang shell without root privileges and restrict commands available to management users. A retest should show approved transfers still work, an uploaded PHP file remains inert, ordinary SSH credentials fail against the management shell, and authorized management tasks run under a dedicated service identity.
