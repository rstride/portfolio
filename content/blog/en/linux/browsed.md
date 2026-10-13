---
id: HTB-2026-BROWSED
title: Browsed
excerpt: "Backend browser requests, Bash arithmetic evaluation, and Python import caches: explaining the conditions behind the reported attack chain."
date: '2026-01-10'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - SSRF
  - COMMAND-INJECTION
  - CACHE-POISONING
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## Chain and prerequisites

Browsed's existing account reports a Chrome-extension verification service, access to internal Gitea source, execution as `larry` through a Bash helper, and root execution through a writable Python import cache. It supplies source excerpts and a sudo rule, but not the extension package, complete HTTP exchange, or bytecode artifact.

Reproduction requires the browser's extension permissions and network reachability, an attacker-controlled input reaching the helper, and a privileged interpreter accepting the modified cache.

## Browser automation as a network boundary

The recorded target `browsed.htb` exposes HTTP on 80 and 8080 alongside SSH. The application runs uploaded extensions in a backend browser. The account says this reaches `browsedinternals.htb`, where Gitea exposes application source.

This is a backend request capability, not proof that all extensions bypass browser restrictions. Record the manifest permissions, request origin, response-reading or exfiltration mechanism, and reachable internal service. Repository access is distinct from permission to invoke the application described by that source.

## Arithmetic is an interpreter boundary

The retained helper excerpt is:

```bash
val=$(( $1 + 10 ))
```

The operation accepts an expression, not necessarily a decimal integer. Bash can recursively evaluate variable values and array subscripts; command-execution consequences depend on the actual expansion path. See the [Bash arithmetic documentation](https://www.gnu.org/software/bash/manual/html_node/Shell-Arithmetic.html). The excerpt alone establishes neither the missing request parameter nor a universally working payload.

The lab reports a reverse connection as `larry`. To substantiate the chain, capture the input, exact helper invocation, network path from the browser, and resulting process identity. A benign numeric result is a positive control, not proof of command execution.

## Python caches have acceptance conditions

The account records this privileged invocation:

```bash
sudo /usr/bin/python3 /opt/tools/extension_tool.py
```

It requires the reported sudo permission. A writable `__pycache__` is identified in an imported helper's directory, but the helper name and cache header are absent. CPython checks interpreter compatibility and timestamp/size or hash invalidation rules. Arbitrary `.pyc` bytes in a writable directory are insufficient. See [Python's cache-invalidation documentation](https://docs.python.org/3/reference/import.html#cached-bytecode-invalidation).

A replay must record the interpreter, actual search path, source presence, cache filename/header, parent permissions, and module imported. The root result remains a reported observation; no bytecode payload is reconstructed.

## Remediation and verification

Isolate extension verification in a worker with restricted egress and no access to internal repositories or host secrets. Test forbidden destinations and approved external fetches; the browser's OS sandbox alone does not define network policy.

Parse and range-check integer input before arithmetic, rejecting expression syntax. Verify ordinary values still work. A blacklist of a few shell characters is insufficient.

Remove unnecessary privileged interpreter delegation or make all imported source, caches, search paths, and parent directories administrator-controlled. Disabling bytecode writes alone does not prevent reading an already poisoned cache.

Monitor worker requests to internal services and writes to modules/caches followed by privileged Python execution. Verify that imports use trusted code after restart, not just that one cache file was deleted. The shared failure is trusting user-controlled material at an execution boundary.
