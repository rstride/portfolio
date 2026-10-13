---
id: HTB-2026-SOULMATE
title: Soulmate
excerpt: "Erlang credential reuse and a privileged local SSH shell: understanding the supported escalation and the missing initial-access evidence."
date: '2025-09-06'
updated: "2026-10-13"
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

## What this account establishes

Soulmate illustrates the risk of a local administrative shell sharing credentials with an ordinary login. The existing account reports SSH access as `ben`, followed by command execution as root through an Erlang SSH service on loopback port 2222.

The initial credential-discovery step is incomplete. It names /usr/local/lib/erlang_login/start.escript, a filesystem path, but supplies no HTTP URL, response, or file-read primitive proving that an unauthenticated visitor could read it. This revision therefore starts from possession of valid `ben` credentials. It does not present web directory enumeration as a demonstrated foothold.

## Prerequisites and enumeration

The target hostname is `soulmate.htb`. Reproducing the supported portion requires a working SSH login as `ben`, access to the local service, and credentials that service accepts. A reachable TCP port alone is insufficient.

From the established host session, the following command lists listening TCP sockets without changing their configuration:

```bash
ss -ltn
```

The lab account records `127.0.0.1:2222` and an Erlang SSH banner. A banner suggests an implementation; it does not identify the service's OS user or prove a vulnerability. Correlate it with the service configuration and process identity where permissions allow.

The account includes a configuration entry shaped as follows; the password is deliberately a placeholder:

```erlang
{user_passwords, [{"ben", "<LAB_PASSWORD>"}]},
```

`<LAB_PASSWORD>` means the credential obtained in the authorized lab. The [Erlang SSH documentation](https://www.erlang.org/doc/apps/ssh/ssh.html) describes daemon authentication and shell configuration. An application shell can execute with the daemon's OS identity even when its SSH username resembles an ordinary system account.

## Reach the service and check the identity

Run this illustrative tunnel from the workstation, using the already established `ben` login:

```bash
ssh -N -L 127.0.0.1:9999:127.0.0.1:2222 ben@soulmate.htb
```

It forwards workstation port 9999 to the target's loopback port 2222. Keep this process running; in a second terminal connect to the forwarded listener:

```bash
ssh -p 9999 ben@127.0.0.1
```

The service still performs its own authentication. The tunnel supplies reachability, not an authentication bypass.

Inside an Erlang shell, the retained identity check is:

```erlang
os:cmd("id").
```

The existing account reports root identity from this check. That supports execution under a root-running daemon. It does not show that every Erlang SSH installation is vulnerable, or establish how the original credentials became publicly available.

## Remediation and verification

Run administrative shells under a dedicated unprivileged account and disable interactive OS-command access when unnecessary. Give the service separate credentials; rotate any secret copied into scripts or reused across services. Limit who can authenticate and forward ports, while preserving required administrative workflows.

Verify both boundaries independently: the ordinary login must not authenticate to the management shell, and an authorized management identity must not obtain root execution. Check service ownership after restart, not just the intended service-unit configuration.

Monitor unexpected authentication to the local daemon and child processes launched by it. Loopback binding reduces remote exposure but does not protect against local users or authenticated tunnels. The remaining evidence gap is the credential acquisition, not the effect of a privileged shell.
