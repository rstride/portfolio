---
id: HTB-2026-TWOMILLION
title: TwoMillion
excerpt: "TwoMillion connects invite discovery, unauthorized role changes, VPN command injection, credential reuse, and an OverlayFS privilege boundary."
date: '2025-09-20'
updated: "2026-10-13"
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

## Chain and evidence

The TwoMillion account describes registration through a discoverable invite workflow, an unauthorized administrator setting update, OS execution through VPN generation, SSH credential reuse, and CVE-2023-0386 elevation.

The administrator request supports an authorization discussion; the complete registration session, command-injection request, and exploit build are absent. The examples identify boundaries without inventing an end-to-end transcript.

## Invite discovery is not automatically a bypass

The host is `2million.htb`. Frontend code points to `POST /api/v1/invite/how/to/generate` and `POST /api/v1/invite/generate`. ROT13 instructions and a base64 value are encodings, not access controls.

Calling a generation workflow does not alone prove an invitation policy was bypassed. Establish who may generate invites and what the server checks. Registration supplies an ordinary session, not administration.

## Settings cross a role boundary

This normalized illustration retains the administrator flag update described in the account; it is not a captured exchange:

```http
PUT /api/v1/admin/settings/update HTTP/1.1
Host: 2million.htb
Cookie: <LAB_SESSION_COOKIE>
Content-Type: application/json

{"email":"test@2million.htb","is_admin":1}
```

`<LAB_SESSION_COOKIE>` means the complete cookie header value from an ordinary authorized lab account. Confirm persistence and a subsequent admin-only operation; `200` alone does not prove elevation.

Examine permission to call the function and permission to change `is_admin` on the selected account. OWASP distinguishes [function-level](https://api-security.owasp.org/editions/2023/en/0xa5-broken-function-level-authorization/) and [property-level authorization](https://api-security.owasp.org/editions/2023/en/0xa3-broken-object-property-level-authorization/).

## VPN generation and another OS identity

The account reports injection through `username` at `POST /api/v1/admin/vpn/generate`, yielding `www-data`. Without the invocation and payload, the exact shell boundary is not reproducible. Inspect string interpolation versus argument passing, including the utility's own option handling.

Reading `.env` supplies credentials reportedly reused for SSH as `admin`. Database permission, file readability, and SSH acceptance are separate facts. The application administrator and the OS account `admin` are also different identities.

## OverlayFS: verify more than the version

The account records Ubuntu 22.04 and `5.15.70-051570-generic`, then reports a FUSE/OverlayFS exploit. CVE-2023-0386 concerns copy-up and UID mapping that can incorrectly preserve privileged file properties. See the [Ubuntu advisory and package status](https://ubuntu.com/security/CVE-2023-0386).

Illustrative local inventory:

```bash
uname -r
findmnt -t overlay,fuse,fuseblk
```

These identify the running kernel and visible mounts, not all prerequisites. Verify provenance, backports, namespace/mount policy, filesystem behavior, and exploit source. The two executable names in the original account are insufficient build/run instructions and are removed.

## Remediation and regression checks

Authorize administrative functions and privileged fields server-side. Derive identity from the session, allowlist mutable fields, and check the target account. Invoke the VPN utility without a shell, with validated arguments and minimal service privileges.

Verify that ordinary accounts cannot change their own or another account's role, valid admin operations work, and metacharacters cannot launch a second command. Rotate leaked credentials and remove reuse. Install the distribution's fixed kernel, reboot, and confirm the running version against vendor status.

Monitor role changes, unexpected web-service children, and privileged-file creation associated with mounts. The risk is the composition of weaknesses, not that invite encoding or an old-looking kernel alone grants root.
