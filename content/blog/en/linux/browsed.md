---
id: HTB-2026-BROWSED
title: Browsed
excerpt: Offensive security write-up.
date: '2026-01-10'
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

# Hack The Box — Browsed (Linux) Write-Up: Extension SSRF → Bash Command Injection → Python Cache Poisoning

## TL;DR
On **Browsed**, initial access is achieved by exploiting a headless Chrome extension upload mechanism to obtain a Server-Side Request Forgery (SSRF) primitive. This allows access to an internal Gitea instance hosting a Flask app. Analyzing the source code reveals a Bash arithmetic injection vulnerability leading to remote code execution as user `larry`. Privilege escalation is achieved by poisoning the world-writable `__pycache__` directory of a python script executable via sudo.

---

## Target
- Host: `browsed.htb`
- IP: `10.10.11.186`

---

## Recon: Port scanning and virtual host discovery

### Nmap TCP Scan
An initial scan reveals three open ports:
- **Port 22/tcp**: SSH (OpenSSH)
- **Port 80/tcp**: HTTP (Nginx)
- **Port 8080/tcp**: HTTP Proxy (Nginx)

**Analysis:** The main web portal on port 80 allows uploading Google Chrome/Chromium extensions to verify them using a backend headless browser.

---

## Initial Foothold: Headless Chrome Extension SSRF

Uploading custom Chrome extensions allows executing JavaScript in the context of the backend headless Chrome instance. By crafting a malicious extension that reads from the local environment and queries internal domains, we establish a Server-Side Request Forgery (SSRF) primitive.

This SSRF reveals an internal Gitea instance hosting source code at `http://browsedinternals.htb`. We locate a Flask application designed for markdown processing.

---

## Remote Code Execution: Bash Arithmetic Injection

Analysis of the Flask source code from the Gitea repository reveals a command execution vulnerability in a helper script that processes markdown headers via Bash arithmetic evaluations:

```bash
# Vulnerable snippet in helper.sh
val=$(( $1 + 10 ))
```

Because the input is not validated, we can inject arbitrary commands. Since the Flask app is reachable via our SSRF primitive, we chain the extension upload to request the Flask application with a payload that triggers a reverse shell. This grants us an active session as the user `larry`.

---

## Privilege Escalation: Python Cache Poisoning

Local enumeration as user `larry` reveals sudo access:

```bash
larry@browsed:~$ sudo -l
(root) NOPASSWD: /usr/bin/python3 /opt/tools/extension_tool.py
```

The `extension_tool.py` script imports helper modules from a local directory where the `__pycache__` folder is world-writable. We can perform Python bytecode poisoning (hijacking the execution flow) by replacing the compiled `.pyc` files.

We compile a payload that spawns a root shell, save it as the targeted compiled bytecode file in the pycache directory, and run the sudo command:

```bash
sudo /usr/bin/python3 /opt/tools/extension_tool.py
```

The hijack triggers, and we drop into a shell as `root`.

---

## Defensive notes / remediation

### Fix
- Sandbox the headless browser environment and disable access to internal network domains (SSRF protection).
- Avoid passing raw user input to Bash arithmetic expressions; sanitize inputs using regex.
- Secure python module search paths and ensure `__pycache__` directories are not writable by non-root users.

### Monitoring / detection ideas
- Audit headless browser network connections to loopback or local private address spaces.
- Monitor execution of python scripts via sudo and alert on writes to `__pycache__` folders by unprivileged users.

---

## Lessons learned
-Headless browser automation requires strict sandboxing to prevent internal service scanning.
-Python directories and bytecode should be strictly owned by root to prevent import hijacking.

---

## Appendix: Timeline summary
1. TCP scan -> Identify web service and extension uploader.
2. Extension SSRF -> Access internal Gitea and locate Flask markdown source code.
3. Exploitation -> Exploit Bash arithmetic injection to get shell as `larry`.
4. Privilege Escalation -> Poison python pycache to execute arbitrary code as root.

---
