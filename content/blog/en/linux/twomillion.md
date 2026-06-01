---
id: HTB-2026-TWOMILLION
title: TwoMillion
excerpt: Offensive security write-up.
date: '2025-09-20'
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - API-BYPASS
  - COMMAND-INJECTION
  - CVE-2023-0386
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

# Hack The Box — TwoMillion (Linux) Write-Up: Invite API Bypass → Admin Promotion RCE → OverlayFS CVE-2023-0386

## TL;DR
On **TwoMillion**, initial access involves bypassing client-side validation in the HTB invite API to register an account, then abusing a broken authorization parameter to promote the account to admin. As admin, we exploit a command injection in the VPN generator to get a shell as `www-data`. Post-exploitation database credentials grant SSH access, and privilege escalation leverages an OverlayFS kernel exploit (CVE-2023-0386) to obtain root.

---

## Target
- Host: `2million.htb`
- IP: `10.129.229.66`

---

## Recon: Open ports and invite portal

### Nmap Scan
- **Port 22/tcp**: SSH
- **Port 80/tcp**: HTTP (Nginx)

The application redirects to `2million.htb`. We inspect the invite code page and locate the script `/js/inviteapi.min.js`.

---

## Initial Foothold: API bypass & command injection

We intercept the invite code generation endpoint:
- `POST /api/v1/invite/how/to/generate` (returns ROT13 instructions)
- `POST /api/v1/invite/generate` (returns base64-encoded invite code)

After registering and logging in, we find the API documentation. We abuse a broken authorization flaw in `PUT /api/v1/admin/settings/update` to elevate our account:

```bash
curl -sS -b cookies.txt -X PUT http://2million.htb/api/v1/admin/settings/update   -H 'Content-Type: application/json'   --data '{"email":"test@2million.htb","is_admin":1}'
```

As admin, we inject a shell payload into the `username` parameter of the VPN profile generator (`POST /api/v1/admin/vpn/generate`) to execute commands and get a shell as `www-data`.

---

## User Access: Database credentials reuse

We inspect the application `.env` file and retrieve the database credentials:
- Username: `admin`
- Password: `SuperDuperPass123`

We reuse these credentials to log in via SSH as `admin` and read the user flag.

---

## Privilege Escalation: OverlayFS / FUSE Exploitation (CVE-2023-0386)

Checking local system details:
- OS: Ubuntu 22.04 LTS
- Kernel: `5.15.70-051570-generic`

The local admin mail highlights a kernel vulnerability. This kernel version is vulnerable to CVE-2023-0386, a local privilege escalation in OverlayFS/FUSE.

We compile the xkaneiki exploit on the target:
```bash
./fuse ./ovlcap/lower ./gc
./exp
```

The exploit triggers, mounting a custom FUSE system to copy a privileged binary into OverlayFS. We execute the SUID root wrapper to obtain root access.

---

## Defensive notes / remediation

### Fix
- Implement proper server-side authentication checks on admin setting update endpoints.
- Sanitize parameters passed to OS commands (such as the VPN generator).
- Apply security updates to the Linux kernel to patch the OverlayFS vulnerability (CVE-2023-0386).

### Monitoring / detection ideas
- Alert on execution of system commands by the `www-data` user.
- Audit the creation and execution of SUID files in FUSE-mounted directories.

---

## Lessons learned
- Client-side invite validation is easily bypassed by reading raw API scripts.
- Kernel exploitation is a common escalation route when systems are left unpatched.

---

## Appendix: Timeline summary
1. Recon -> Bypass invite API, register account.
2. Foothold -> Promote user to admin via API parameters, inject shell command, get shell as `www-data`.
3. User -> Reuse DB credentials to log in via SSH as `admin`.
4. Privilege Escalation -> Exploit OverlayFS (CVE-2023-0386) to get root.

---
