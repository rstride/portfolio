---
id: HTB-2026-SOULMATE
title: Soulmate
excerpt: Offensive security write-up.
date: '2025-09-06'
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

# Hack The Box — Soulmate (Linux) Write-Up: Erlang Configuration Leak → Local Erlang SSH shell RCE

## TL;DR
On **Soulmate**, initial access is obtained by exploiting an information leakage vulnerability in an Erlang configuration file that contains cleartext credentials. This allows SSH login as user `ben`. Privilege escalation leverages a local Erlang SSH service listening on localhost port 2222. By establishing a port tunnel and executing commands inside the Erlang shell, we obtain root execution.

---

## Target
- Host: `soulmate.htb`
- IP: `10.129.231.23`

---

## Recon: Exposed erlang configuration file

### Network Ports Scan
- **Port 22/tcp**: SSH
- **Port 80/tcp**: HTTP (Nginx)

During web directory and file discovery, we locate an exposed Erlang startup script at `/usr/local/lib/erlang_login/start.escript`. Inside, we find cleartext credentials:

```erlang
{user_passwords, [{"ben", "HouseH0ldings998"}]},
```

---

## Initial Foothold: SSH login

Using the leaked credentials, we authenticate via SSH:
- Username: `ben`
- Password: `HouseH0ldings998`

We log in successfully and retrieve the user flag from `/home/ben/user.txt`.

---

## Privilege Escalation: Local Erlang SSH Service

Once inside, we list internal listening ports:

```bash
ss -tuln
```

We observe a service running on `127.0.0.1:2222`, which responds with:
```text
SSH-2.0-Erlang/5.2.9
```

Because this is a local Erlang shell service, we establish an SSH tunnel to forward remote port 2222 to local port 9999:

```bash
ssh -L 9999:127.0.0.1:2222 ben@10.129.231.23
```

We connect to our forwarded port:
```bash
ssh -p 9999 ben@127.0.0.1
```

Once inside the Erlang shell, we execute system commands using the `os` module:

```erlang
(ssh_runner@soulmate)1> os:cmd("id").
"uid=0(root) gid=0(root) groups=0(root)\n"
```

The Erlang service runs as root, granting us complete system control. We read the root flag from `/root/root.txt`.

---

## Defensive notes / remediation

### Fix
- Ensure that configuration scripts and system deployment scripts containing cleartext credentials are not exposed on web-accessible directories.
- Bind internal services like Erlang SSH interfaces with proper authentication policies and restrict loopback shell access.

### Monitoring / detection ideas
- Alert on files containing key patterns like `user_passwords` in public web server directories.
- Monitor loopback port forwarding or tunneling attempts on SSH sessions.

---

## Lessons learned
- Cleartext credentials leaked in script backups are immediate foothold vectors.
- Internal administrative consoles (like Erlang/Python interactive shells) running as root should be strictly secured.

---

## Appendix: Timeline summary
1. Recon -> Scan web root, locate Erlang config script, retrieve credentials.
2. Foothold -> Log in via SSH as `ben`.
3. Privilege Escalation -> Locate Erlang SSH on port 2222, tunnel, execute OS command as root.

---
