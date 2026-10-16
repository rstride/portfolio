---
id: HTB-2026-SNAPPED
title: Snapped
excerpt: "Snapped exposes an Nginx UI backup together with its decryption material, then uses a local snapd namespace race after SSH access."
date: '2026-03-23'
updated: "2026-10-15"
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

## The two independent weaknesses

The path is **virtual-host discovery → unauthenticated `/api/backup` → encrypted backup members and their key/IV → database password hash → SSH as `jonathan` → snapd and `systemd-tmpfiles` interaction → root**. The backup defect crosses a web authentication boundary. The snapd defect crosses a local filesystem ownership boundary. An application version and a package version are useful leads, but neither alone proves a successful exploit.

`snapped.htb` and `admin.snapped.htb` are lab names. Downloaded archives and extracted secrets should stay in a temporary working directory and be removed after testing. All commands below are for an authorized lab; no password, key, hash, or exploit payload is reproduced.

## Discover the administrative host

A TCP scan finds SSH and HTTP. The main site is largely static. Virtual-host enumeration reveals `admin.snapped.htb`, where Nginx UI runs. Ensure the name resolves to the lab IP before testing the admin site; a request with a bare IP can select the wrong virtual host. Fingerprint the application from its own interface and files rather than from the front-end nginx banner. The lab shows Nginx UI 2.3.2.

CVE-2026-27944 concerns an unauthenticated backup endpoint in affected Nginx UI installations. The [project advisory](https://github.com/0xJacky/nginx-ui/security/advisories/GHSA-g9w5-qffc-6762) describes the missing authorization and the key disclosure. Test the route directly without a session cookie, recording both body and headers from **the same response**:

```bash
curl -sS -D backup.headers -o backup.zip 'http://admin.snapped.htb/api/backup'
file backup.zip
unzip -l backup.zip
```

The first command saves headers separately from the binary body so a ZIP is not printed to the terminal. The response's `X-Backup-Security` header contains two Base64 strings separated by a colon: an AES key and initialization vector. In this lab they decode to 32 and 16 bytes respectively, suitable for AES-256-CBC. The values can change on each download, so a header from an earlier request may fail to decrypt a later archive. An HTTP 200 without the ZIP and the matching header is not enough to demonstrate the leak.

The downloaded body is an **outer ZIP**. Its members include `hash_info.txt`, `nginx-ui.zip`, and `nginx.zip`; the members are encrypted data despite their names. First extract the outer archive. Decode the header's Base64 components to raw bytes, convert them to hex for OpenSSL's `-K` and `-iv` parameters, and decrypt an individual member with `openssl enc -aes-256-cbc -d`. Inspect its file type after decryption before trying to unzip it. Feeding the outer ZIP directly to AES decryption is the wrong layer. If OpenSSL reports bad padding, first check that key and IV came from the same HTTP response and that the input is an encrypted inner member.

The decrypted Nginx UI archive contains `database.db`, a SQLite database. Inspect the schema and the relevant `users` rows. The lab's `jonathan` record uses bcrypt. Identify the hash prefix and select the corresponding offline mode rather than trusting automatic detection. Bcrypt slows guesses; it does not make a weak password unguessable. Validate a recovered candidate through SSH and run `id` in that session. The presence of a hash in a backup is a disclosure; the successful SSH login is an additional reuse or password-choice failure.

## Check the snapd prerequisites locally

From `jonathan`, inventory the installed snapd package, privileged helper, and cleanup schedule:

```bash
dpkg-query -W -f='${Version}\n' snapd
ls -l /usr/lib/snapd/snap-confine
systemctl list-timers systemd-tmpfiles-clean --all
cat /usr/lib/tmpfiles.d/tmp.conf
```

The lab has a SUID `snap-confine` from snapd 2.63.1+24.04. Its `/tmp` cleanup rule uses a short retention interval, and the timer runs frequently. The exact effective rule may be overridden elsewhere, so inspect active configuration as well as this vendor file. CVE-2026-3888 relies on a race: `systemd-tmpfiles` can remove a snap private temporary directory while `snap-confine` later recreates and trusts it during mount-namespace construction. A local attacker able to place replacement content at the right time can influence a privileged operation. The [Ubuntu advisory](https://ubuntu.com/security/CVE-2026-3888) explains affected package branches and fixed revisions.

This is timing dependent. A package banner alone, or an active cleanup timer alone, is insufficient. Check distribution release, installed package revision, SUID or capability layout, effective `/tmp` cleanup rule, and whether the service uses the vulnerable namespace path. A proof of concept must match that layout. Record the precondition and the resulting effective UID; a root-owned file created after a race is stronger evidence than a script's success message. Avoid repeating an invasive payload just to validate a patch: compare installed vendor package status and run a controlled regression check in a disposable snapshot.

## Failure analysis and remediation

If the backup request redirects to a login, verify the correct virtual host, URL path, cookies, and middleware. If extraction succeeds but decryption fails, inspect the ZIP layering and key/IV pairing. If the candidate password is rejected by SSH, confirm hash type, account association, and whether the secret is still current. If a snapd proof of concept fails intermittently, distinguish normal race failure from a fixed package or absent cleanup precondition; do not infer vulnerability from the mere presence of snapd.

Upgrade Nginx UI to a maintained fixed release and enforce authentication on backup creation. Never send an encryption key in the same unauthenticated response as the encrypted data. Rotate any credentials exposed by past downloads. Update snapd using the distribution's security packages, verify the installed fixed revision for that release, and restart affected components as vendor guidance requires. A retest should deny unauthenticated backup access while preserving authorized backup and restore, reject the old SSH password, and show the repaired snapd package and safe temporary-directory behavior. Monitor unusual backup downloads and privileged file creation near snap namespace activity, with request and process context.
