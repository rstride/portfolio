---
id: HTB-2026-CONVERSOR
title: Conversor
excerpt: Path traversal in an upload workflow enables cron-job hijacking, followed by credential reuse and a sudo Needrestart escalation to root.
date: '2025-10-25'
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - EASY
  - PATH-TRAVERSAL
  - CRON-HIJACK
  - NEEDRESTART
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: EASY
severity: LOW
icon: Terminal
author: '0x7CC'
---

## TL;DR
On **Conversor**, a path traversal vulnerability in the file upload endpoint allows writing arbitrary scripts into a directory executed by a root cron job, yielding code execution as `www-data`. Credential reuse from the local database allows SSH access as user `fismathack`. Finally, privilege escalation is achieved by exploiting a misconfigured sudo entry for `needrestart` to run a custom Perl configuration file containing malicious commands.

---

## Target
- Host: `conversor.htb`
- IP: `10.129.7.27`

---

## Recon: Directory enumeration exposes source code

### Nmap Scan
- **Port 22/tcp**: SSH
- **Port 80/tcp**: HTTP (redirects to `http://conversor.htb`)

Directory enumeration on port 80 reveals an exposed archive containing the application source code: `source_code.tar.gz`.

---

## Initial Foothold: Path Traversal and Cron Hijack

Analyzing the extracted `app.py` reveals a path traversal vulnerability in the `/convert` upload endpoint. The filename parameter is not sanitized:

```python
# Vulnerable file upload path handling
file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
```

We also identify a root-owned cron job that executes all Python scripts in the `/var/www/conversor.htb/scripts/` directory every minute. By using path traversal (`filename='../scripts/pwn.py'`), we upload a reverse shell payload that executes automatically, giving us a shell as `www-data`.

---

## User Access: Database extraction & credential reuse

We locate a local database file `users.db`. Dumping the database yields the MD5 hash for the user `fismathack`:
- Hash: `5b5c3ac3a1c897c94caad48e6c71fdec`
- Cracked password: `Keepmesafeandwarm`

We log in via SSH using these credentials to obtain the user flag.

---

## Privilege Escalation: Sudo Needrestart Exploitation

Running `sudo -l` reveals:
```bash
(ALL : ALL) NOPASSWD: /usr/sbin/needrestart
```

The `needrestart` utility checks which daemons need to be restarted. It supports a `-c` flag to specify a configuration file, which is loaded and evaluated as Perl code. We write a malicious configuration file `pwn.conf` containing Perl code to copy and elevate bash:

```perl
system("cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash");
```

We run the tool with our config file:
```bash
sudo needrestart -c /home/fismathack/pwn.conf
```

This triggers the Perl code execution as root. We execute `/tmp/rootbash -p` to access root and read the flag.

---

## Defensive notes / remediation

### Fix
- Use `secure_filename` from Werkzeug to sanitize uploaded file names.
- Restrict write access to directories that run cron scripts.
- Do not allow users to pass arbitrary config files to tools executed via sudo.

### Monitoring / detection ideas
- Monitor filesystem write events inside critical system script directories.
- Alert on sudo executions of `needrestart` containing the `-c` command-line parameter.

---

## Lessons learned
- Path traversal vulnerabilities in file uploads can easily lead to RCE if system scripts are writable.
- Executing system management utilities with sudo should be done with tight controls over command-line arguments.

---

## Appendix: Timeline summary
1. Recon -> Locate port 80 and download source code archive.
2. Exploit -> Leverage path traversal to write a script in the cron directory.
3. User Access -> Dump SQLite DB, crack password, SSH as `fismathack`.
4. Privilege Escalation -> Leverage `needrestart -c` Perl execution to gain root.

---
