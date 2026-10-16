---
id: HTB-2026-MONITORSFOUR
title: MonitorsFour
excerpt: "MonitorsFour starts with a broken token comparison, reaches a Cacti container, and uses an exposed Docker Desktop API to reach Windows host files."
date: '2025-12-06'
updated: "2026-10-15"
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

## Understand the three boundaries

The chain is **HTTP user lookup → password hash → Cacti login → Cacti graph injection → Linux container shell → Docker Engine API → Windows host drive**. The first access is a data disclosure, the second is authenticated application code execution, and the last is control of a different container and its host mounts. Windows is the machine's platform, but the Cacti process runs in Linux. `root` in that container is not the same principal as Windows Administrator.

`monitorsfour.htb` and `cacti.monitorsfour.htb` refer to lab virtual hosts. Commands below are diagnostics for the authorized machine; no passwords, flag values, or exploit script bodies are included. A readable Windows file through a mount proves host filesystem access. It does not by itself prove Windows code execution.

## Discover the credential disclosure

Initial network and virtual-host enumeration finds the company site and the Cacti hostname. Before trying Cacti exploits, inspect application routes on the company site. `/user` responds with an error when no token is supplied, which identifies the expected parameter. A controlled request to `/user?token=0` returns user records, including password hashes. A response containing the full user list is stronger evidence than a status code alone; check that unauthenticated or ordinary callers should not receive those fields.

The underlying PHP token check loops over stored token strings and uses loose equality, `==`. One stored token has a `0e...` shape consisting of digits after the `e`. PHP interprets both that string and `"0"` as numeric zero in a loose comparison. The function therefore treats the supplied zero as matching a stored token. This is a specific numeric-string collision, not a claim that `0` matches every token. PHP's [comparison documentation](https://www.php.net/manual/en/language.operators.comparison.php) explains type conversion in loose comparisons. The endpoint compounds the mistake by returning entire user rows, including hashes, after any token passes.

This illustrative request checks the disclosure without dumping the full dataset into notes:

```bash
curl -s 'http://monitorsfour.htb/user?token=0' | jq '.[].username'
```

`jq` prints usernames from a JSON array; if the application returns an error object, this filter is the wrong shape and the bypass has not been established. Retain only enough evidence to show that an unauthorized request reached the protected records. The stored passwords are MD5 hashes in the lab; identify the format before an authorized offline guess. A recovered candidate becomes useful only after Cacti accepts it. On this machine the user `marcus` can authenticate there. The information disclosure and the login are distinct checks.

## Use Cacti's graph boundary

Cacti 1.2.28 is exposed on the second host. CVE-2025-24367 affects authenticated graph functionality when a user has the required graph permissions. Crafted graph options containing a newline can change the arguments passed to RRDtool, allowing a write to a PHP file served by the application. The [Cacti advisory](https://github.com/Cacti/cacti/security/advisories/GHSA-fxrq-fr7h-9rqq) identifies the affected behavior and fixed release. A login alone is insufficient: the user must reach the vulnerable graph action, and the target directory must allow the resulting file write.

For a replay, identify the installed Cacti version, the `marcus` session, graph/template permissions, the request that changes the RRDtool input, and the output file. First test with a harmless diagnostic file and read it over HTTP. A successful graph page only proves the page loaded. A readable PHP diagnostic that reports `www-data` establishes server-side execution. If a public exploit script is used, review its source and expected arguments; do not treat a filename such as `exploit.py` as an explanation. Record the actual HTTP request and generated path rather than relying solely on the script's success message.

Once inside, `id`, `cat /proc/1/cgroup`, and filesystem inspection help establish that the shell is inside a Linux container. The host may run Docker Desktop on Windows with WSL2. Distinguishing those contexts prevents the common mistake of describing a Cacti shell as a Windows SYSTEM shell.

## Test the Docker control plane

The container can reach the Docker Engine API at `192.168.65.7:2375` in this lab. That is a TCP service reached through Docker Desktop's internal subnet. A mounted `/var/run/docker.sock`, if present, would be a separate Unix-socket route; test the interface actually observed. Start with a read-only request:

```bash
curl -sS http://192.168.65.7:2375/version | jq '{Version,ApiVersion,Os,Arch}'
```

A version response proves connectivity to an Engine API. It does not prove that every endpoint is permitted, so test authorization before claiming container creation. CVE-2025-9074 describes container access to this internal API in affected Docker Desktop setups. [Docker's Engine security documentation](https://docs.docker.com/engine/security/) explains why control of the daemon is privileged: the daemon can create containers with host mounts.

The next trust boundary is the `HostConfig.Binds` source. In Docker's create request, a bind source is resolved on the **daemon host**, not relative to the requesting Cacti container. For this Docker Desktop setup, `/mnt/host/c` maps to the Windows C: drive. A newly created container can mount that source at a path inside itself and read files reachable through it. Check the daemon's image availability and the actual mount mapping before sending a create request; a JSON object describing an image that does not exist or a source path that differs will fail. A successful create response gives a container ID, but the container must also start and the mount must be checked from inside it.

An illustrative create request makes the trust boundary explicit. `<EXISTING_IMAGE>` is an image already present on the daemon and containing `sh`; the bind is read-only for this diagnostic:

```http
POST /containers/create HTTP/1.1
Host: 192.168.65.7:2375
Content-Type: application/json

{"Image":"<EXISTING_IMAGE>","Cmd":["sh","-c","ls -ld /host-c/Windows"],"HostConfig":{"Binds":["/mnt/host/c:/host-c:ro"]}}
```

The response should provide a container ID. Starting that ID and reading its logs are separate API operations; an ID alone does not establish that the mount exists. `ls` checks only for a directory, so a meaningful retest uses an approved canary file on the host drive and compares its content from the new container. This request is a teaching example, not a captured packet from the lab.

The original lab result is access to Windows host files through the bind. Docker's `Privileged` flag is not necessary for that specific read and should not be conflated with host mounts. Host file read does not establish Windows process execution. Any later scheduled-task route to a Windows shell would require its own evidence and is outside the minimal chain taught here.

## Read each result at the correct boundary

| Observation | Conclusion it supports | Conclusion it does not support |
| --- | --- | --- |
| `/user?token=0` returns users and hashes. | The token gate and response filtering are broken. | Cacti credentials have already been recovered. |
| `marcus` signs in to Cacti and can reach graphs. | The leaked credential works and the role has relevant graph access. | RRDtool has written an executable file. |
| A harmless PHP diagnostic runs from the Cacti URL. | The graph-input route crossed into server-side execution. | The shell runs as Windows Administrator. |
| `/version` answers on TCP 2375 from the container. | The application container can reach the Docker API. | The caller can create a container or mount the host drive. |
| A new container reads an approved file from `/mnt/host/c`. | The daemon honored a host-drive bind and exposed Windows files. | A Windows process ran with an Administrator token. |

This separation matters during troubleshooting and remediation. The first two stages concern application authorization; the third concerns code generation and filesystem writes inside Linux; the last concerns Docker Desktop's host integration. A defender can fix one boundary and leave others exposed. Retest with different canaries for the PHP write and the Windows mount, and record the process or container ID that produced each observation. Avoid using the existence of a Windows path as shorthand for full host compromise: file access, file modification, and host code execution are different capabilities.

## Diagnose and repair

If `token=0` is rejected, inspect the PHP version and the stored token shape; the weakness depends on a numeric-string collision and loose comparison. If Cacti authentication works but the graph exploit does not, check the role's graph rights, exact installed version, newline handling, RRDtool invocation, and web-root write permissions. If `/version` responds but a container cannot be created, inspect API permissions, daemon image inventory, and the create/start responses. If `/mnt/host/c` appears empty, verify which host and backend the daemon actually controls.

Fix the token check with constant-time string comparison against the expected token, and avoid returning password hashes in user-profile responses. Rotate exposed credentials and replace unsalted MD5 storage. Upgrade Cacti to a maintained fixed version and remove writable paths that permit PHP execution. Update Docker Desktop, restrict container-to-daemon traffic and host-drive sharing, and require authenticated, authorized management. Retest each boundary separately: an unauthenticated lookup returns no user rows, approved graphs still render without creating PHP, the application container cannot use the Engine API, and a low-privilege process cannot bind the Windows drive.
