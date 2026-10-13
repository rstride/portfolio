---
id: HTB-2026-MONITORSFOUR
title: MonitorsFour
excerpt: "Cacti graph-option injection and Docker daemon access: separating the container foothold from access to the Windows host filesystem."
date: '2025-12-06'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - EASY
  - CACTI
  - CVE-2025-24367
  - DOCKER-ESCAPE
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: EASY
severity: LOW
icon: Terminal
author: '0x7CC'
---

## Chain and prerequisites

MonitorsFour combines a Windows-facing target with execution inside a Linux container. The existing account reports a Cacti login as `marcus`, command execution as `www-data`, then access to a Docker daemon and a mounted Windows filesystem.

Its initial hash acquisition is undocumented: “dump local database hashes” does not explain how a remote visitor reads the database. This account therefore begins with valid Cacti credentials. It also does not establish whether a Unix socket or a TCP API supplied daemon access; those are different interfaces and must not be treated as interchangeable observations.

## Cacti: authentication is only the first condition

The recorded web hostname is `cacti.monitorsfour.htb`. CVE-2025-24367 affects Cacti through 1.2.28 and was fixed in 1.2.29. It requires an authenticated user able to use the affected graph functionality. Newlines in graph options can introduce additional RRDtool operations that write PHP content into a web-served file. See the [Cacti advisory](https://github.com/Cacti/cacti/security/advisories/GHSA-fxrq-fr7h-9rqq).

A defensible reproduction records the installed version, graph privileges, triggering action, created file, and resulting process identity. The existing `exploit.py` invocation lacks the script's provenance and argument contract, so it is not retained as a reproducible instruction. The account's reported `www-data` shell is a container foothold, not yet Windows administrator execution.

## Docker access: identify the actual control plane

A mounted `/var/run/docker.sock` exposes a Unix socket if its permissions allow access. `192.168.65.7:2375` instead identifies an HTTP daemon endpoint in the original account. Finding either path or port does not prove permission to create containers.

For an authorized diagnostic replay, the following are alternative read-only examples. Use only the interface actually observed:

```bash
curl --unix-socket /var/run/docker.sock http://localhost/version
curl http://192.168.65.7:2375/version
```

The first targets the local socket; the second targets the recorded TCP listener. A version response establishes API reachability, not all administrative permissions. Docker explains why controlling the daemon is security-sensitive in its [Engine security documentation](https://docs.docker.com/engine/security/).

## Distinguish filesystem access from host execution

The retained account describes creating a container with a bind source `/mnt/host/c` and reading Windows files through its mount. The source path is resolved on the daemon's host, not in the client's filesystem. Its existence and mapping to the Windows drive must be verified for that deployment.

The original JSON does not set `Privileged: true`; a host bind and a privileged container are distinct settings. Root inside a Linux container is also not Windows SYSTEM. Reading an Administrator-owned file through an exposed host mount supports host-data access; it does not alone prove arbitrary execution on Windows.

## Remediation and verification

Upgrade Cacti to a currently maintained release containing the fix, restrict graph-template editing, and remove files created during exploitation. Confirm the installed application rather than relying on the image tag.

Remove unneeded daemon sockets and network exposure from application containers. Apply authenticated, authorized daemon access for necessary management, and restrict host-drive sharing. In a disposable environment, check that the application identity cannot reach the daemon or create a host bind; verify normal graph generation still succeeds.

Monitor unexpected PHP writes in Cacti's web root, container-originated daemon requests, and creation of containers with host-drive binds. Record the requested mount and caller: these explain the escalation better than labeling every container access a “Docker escape.”
