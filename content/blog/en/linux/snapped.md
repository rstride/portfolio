---
id: HTB-2026-SNAPPED
title: Snapped
excerpt: "Nginx UI backup disclosure and snapd namespace cleanup: prerequisites, evidence limits, and release-specific patch verification."
date: '2026-03-23'
updated: "2026-10-13"
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

## Attack chain and prerequisites

The Snapped account records discovery of `admin.snapped.htb`, download of an Nginx UI backup, recovery of a `jonathan` password, SSH access, and a snapd local elevation. The two vulnerabilities cross different boundaries: unauthenticated web access to sensitive backup material, then local access to privileged namespace handling.

The account does not retain the complete backup request, hash format, cracking transcript, or local exploit source. Treat the successful logins and root access as reported lab results, not a reproduction independently established by this article.

## Backup disclosure: the key travels with the ciphertext

The account identifies `/api/backup` and an `X-Backup-Security` response header. The [Nginx UI advisory for CVE-2026-27944](https://github.com/0xJacky/nginx-ui/security/advisories/GHSA-g9w5-qffc-6762) describes missing authentication and disclosure of a base64-encoded AES key and IV with the archive. It lists 2.3.3 as the patched version; its affected-version table and the lab's reported 2.3.2 do not establish a reliable version-only match. Verify the deployed route and authentication middleware.

The following is an illustrative request, not a captured response:

```http
GET /api/backup HTTP/1.1
Host: admin.snapped.htb
```

In a controlled replay, record whether an unauthenticated request returns an archive, whether key material accompanies it, and what data the decrypted members actually contain. Encryption does not protect against a recipient who also receives the key. Distinguish the outer archive from encrypted members; blindly decrypting the entire download can fail.

The account then reports recovery of `jonathan` credentials from the database and reuse for SSH. Confirm the stored hash format before choosing a cracking mode. Successful recovery and SSH acceptance are separate observations.

## Local elevation: cleanup is a prerequisite

CVE-2026-3888 concerns recreation of a snap private temporary directory after `systemd-tmpfiles` cleanup. It requires the relevant cleanup configuration, not just snapd installation. The lab reports package `2.63.1+24.04` and a timing-dependent exploit but lacks the build and execution details needed for replay. See the [Ubuntu advisory](https://ubuntu.com/security/CVE-2026-3888).

These illustrative inventory commands run inside the established SSH session:

```bash
dpkg-query -W -f='${Version}\n' snapd
systemctl status systemd-tmpfiles-clean.timer --no-pager
```

The first gives the installed package revision. The second identifies timer state, which must be considered alongside the effective cleanup rules and directory state; a running timer alone does not prove exploitability.

## Patch by distribution and validate

As of this revision, Ubuntu lists these fixed snapd packages:

| Ubuntu release | Fixed package |
| --- | --- |
| 24.04 LTS | `2.73+ubuntu24.04.2` |
| 22.04 LTS | `2.73+ubuntu22.04.1` |

For Ubuntu 20.04 LTS with Ubuntu Pro, the listed fixed package is `2.67.1+20.04ubuntu1~esm1`. Use the advisory for other releases and subsequent updates. The old blanket recommendation `2.63.2+` is insufficient. Verify the installed distribution package and restart affected services as required.

Upgrade Nginx UI to a maintained release containing the authentication fix and rotate exposed credentials and secrets. Verify that an unauthenticated backup request returns neither archive nor key, while an authorized backup still works. Patching does not revoke secrets already downloaded.

Monitor backup downloads outside approved workflows and unusual SUID-file creation in snap application directories. Preserve timing and process provenance when investigating namespace activity; do not infer a successful race from a snap-confine invocation alone.
