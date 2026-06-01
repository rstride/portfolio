---
id: HTB-2026-SNAPPED
title: Snapped
excerpt: Offensive security write-up.
date: '2026-03-23'
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - BACKUP-DISCLOSURE
  - NGINX-UI
  - CVE-2026-3888
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

# Hack The Box — Snapped (Linux) Write-Up: Nginx UI Backup Disclosure → snapd CVE-2026-3888 Race

## TL;DR
On **Snapped**, a virtual host scan reveals an instance of `Nginx UI`. We exploit an unauthenticated backup disclosure vulnerability to download decrypted configuration files containing user hashes. Cracking the hash for user `jonathan` yields SSH access. Privilege escalation is achieved by exploiting a timing-sensitive local privilege escalation vulnerability in snapd (`snap-confine`, CVE-2026-3888) to drop a SUID root bash shell.

---

## Target
- Host: `snapped.htb`
- IP: `10.129.11.109`

---

## Recon: Virtual host discovery

### Ports Scan
- **Port 22/tcp**: SSH
- **Port 80/tcp**: HTTP (Nginx)

Fuzzing host subdomains reveals a virtual host: `admin.snapped.htb`. Browsing to this host shows a Vue-based portal running `Nginx UI`.

---

## Initial Foothold: Nginx UI Backup Disclosure

By searching the frontend Javascript assets, we discover the application version is `2.3.2`. This version suffers from an unauthenticated backup disclosure vulnerability via the `/api/backup` endpoint. 

We query the endpoint and receive an encrypted ZIP archive alongside a custom security header:

```text
X-Backup-Security: u4E1hLbHbecstMPa41mMXyFfeGLX+PzkpFihGVLhlII=:lTVjEZe1kv+XqOtozO9N/Q==
```

The header contains the base64-encoded AES-256-CBC key and initialization vector (IV) separated by a colon. We decrypt the backup, extract the SQLite database (`database.db`), and dump the database users. We crack the bcrypt hash for user `jonathan`:
- Username: `jonathan`
- Password: `linkinpark`

We log in via SSH to obtain the user flag.

---

## Privilege Escalation: snapd snap-confine Race (CVE-2026-3888)

Local enumeration reveals that snapd is running version `2.63.1+24.04`, which contains a local privilege escalation vulnerability in `snap-confine` (CVE-2026-3888). The vulnerability lies in a race condition with `systemd-tmpfiles` cleanup of namespace directories.

We cross-compile the exploit for x86_64 architecture and upload it. Because `/tmp` cleanup occurs periodically, we must wait for the local `.snap` directory to be processed:

1. Execute the exploit in wait mode.
2. Monitor `/proc/<pid>/root/tmp/.snap`.
3. When ownership changes, unblock the race window.

The exploit succeeds and drops a SUID root bash shell at `/var/snap/firefox/common/bash`. We run `/var/snap/firefox/common/bash -p` to read the root flag.

---

## Defensive notes / remediation

### Fix
- Upgrade Nginx UI to the latest patched version to prevent unauthenticated backup leaks.
- Keep snapd updated to patched releases (`2.63.2+`) to remediate CVE-2026-3888.
- Restrict write privileges on local mounts and audit creation of SUID files in application folders.

### Monitoring / detection ideas
- Alert on HTTP requests to `/api/backup` that bypass authentication checks.
- Audit execution of `snap-confine` and monitor system logs for suspicious temporary namespace directory creation.

---

## Lessons learned
- Virtual host discovery is crucial for uncovering administrative portals.
- Race conditions in local setuid binaries like `snap-confine` can be highly reliable if system triggers are monitored.

---

## Appendix: Timeline summary
1. Recon -> Scan subdomains, locate Nginx UI on `admin.snapped.htb`.
2. Foothold -> Leak backup via `/api/backup`, decrypt, crack database hash, and SSH as `jonathan`.
3. Privilege Escalation -> Exploit snap-confine race (CVE-2026-3888) to get root.

---
