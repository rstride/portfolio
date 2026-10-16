---
id: HTB-2026-TWOMILLION
title: TwoMillion
excerpt: "TwoMillion is an API authorization lesson that becomes a command-injection and local privilege-escalation chain. Each API response must be interpreted in the context of the caller's role."
date: '2025-09-20'
updated: "2026-10-15"
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

## Route through the machine

The lab path is **invite discovery → ordinary account → unauthorized admin-setting update → VPN-generation command injection as `www-data` → application secret reused for SSH as `admin` → OverlayFS local elevation**. The invitation encoding is a puzzle rather than a security control. Registration creates a normal session; the later settings request is the authorization failure. `admin` as an application role, `admin` as a Unix account, and root are different identities.

The target hostname is `2million.htb`. `<LAB_SESSION_COOKIE>` is an ordinary authenticated lab session, and `<ATTACKER_IP>` refers to a controlled address. No real session, password, exploit binary, or flag is included. The HTTP examples show request shape; they are not captured transcripts.

## Read the client, then verify the server

TCP enumeration identifies SSH and the web application. The page's JavaScript points to invitation routes including `/api/v1/invite/how/to/generate` and `/api/v1/invite/generate`. The guidance is ROT13-encoded, and a returned invitation is Base64-encoded. Decoding these values reveals an invite workflow. It does not establish a vulnerability by itself: the relevant policy question is whether the server should allow unauthenticated invitation generation. Record a working invitation and use it to register a normal user. Check the resulting session on a user-only page before attempting administrator routes.

An API inventory becomes useful after login. The settings route accepts an `is_admin` property supplied by the caller. This normalized request demonstrates the risk:

```http
PUT /api/v1/admin/settings/update HTTP/1.1
Host: 2million.htb
Cookie: <LAB_SESSION_COOKIE>
Content-Type: application/json

{"email":"test@2million.htb","is_admin":1}
```

A normal user should not be able to call an admin function or set a privileged field. The defect is a missing or ineffective server-side authorization check, potentially compounded by mass assignment of `is_admin`. OWASP distinguishes [function authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/) from [property authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/). A `200` response alone is weak evidence: read the account's effective role again and perform a benign admin-only operation. Also test another user's record to determine whether the endpoint trusts the submitted email. The goal is to show whose role changed and why the caller was allowed.

If the request fails, check that the cookie belongs to an ordinary logged-in account, the method and content type, CSRF behavior, and the exact field types accepted. Do not treat a missing invitation code as evidence about admin authorization; those are different stages.

## Follow VPN generation to a shell

With the newly elevated **application** role, the user can invoke `POST /api/v1/admin/vpn/generate`. The endpoint accepts a username that is incorporated into a server-side command used to generate a VPN profile. The dangerous boundary occurs if the application constructs a shell string and treats user text as command syntax. Inspect the route's source or a trace to see whether it uses a shell and how arguments are quoted. A harmless probe can request a generated profile for a normal username, then use an input with metacharacters whose only side effect is a marker. Compare both responses and check the process identity. The lab's documented result is code execution as `www-data`. An error response or a generated file alone does not prove command injection.

This is separate from the broken role update. A correctly authorized administrator could still be harmed by an unsafe command sink, and a fixed command sink would still leave the role escalation. Both boundaries need a repair. The privileged API session is a web role; the shell belongs to the operating-system account running the web service.

From that shell, the application `.env` file contains credentials. Check its ownership and why the web process can read it. The lab reuses a password for the Unix account `admin`. Test SSH with the candidate and run `id` after login; reading `.env` does not itself become that OS account. Avoid printing the complete environment file into notes because it may include unrelated secrets.

## Check OverlayFS carefully

The local root step uses CVE-2023-0386, an OverlayFS copy-up flaw involving ownership or capabilities when files cross mount and user-namespace boundaries. The lab records Ubuntu 22.04 and kernel `5.15.70-051570-generic`. That string suggests an older mainline kernel but does not prove exploitability; distributions may backport fixes, and a custom build may differ from the version it resembles. The [Ubuntu security entry](https://ubuntu.com/security/CVE-2023-0386) gives release-specific package status.

An authorized inventory from the `admin` shell is:

```bash
uname -r
findmnt -t overlay,fuse,fuseblk
sysctl kernel.unprivileged_userns_clone
```

The first command reports the running kernel, the second visible mounts, and the third a common user-namespace policy knob. They do not exhaust the prerequisites. The public proof of concept also depends on available FUSE behavior, writable working directories, architecture, and a matching build. Review its source and compile instructions; do not run anonymous binaries merely because their names match a walkthrough. A successful tool exit is not the endpoint: verify the resulting effective UID, capabilities, and the actual privilege boundary. If it fails, check the running kernel after reboot, filesystem support, namespace policy, and tool provenance rather than changing random payload bytes.

## Repair and regression tests

Make invitation policy explicit on the server; encoding a message never restricts access. Require administrator authorization on every admin route, derive the account identity from the session, and allowlist mutable fields so `is_admin` cannot be set by ordinary users. Execute the VPN generator with fixed argument arrays rather than a shell string, validate username syntax, and run the web service under minimal privileges. Move secrets out of readable application files where possible and rotate those already exposed or reused for SSH.

Install the distribution's fixed kernel, reboot, and verify the **running** kernel and vendor package status. Retest registration, normal VPN generation, unauthorized role changes, metacharacter-shaped usernames, old SSH credentials, and local namespace behavior. Log admin role changes and VPN-generation failures together with unexpected web-service child processes; monitor privileged file creation in overlay mounts. The machine illustrates how individually narrow defects compose into root access only when every required transition succeeds.
