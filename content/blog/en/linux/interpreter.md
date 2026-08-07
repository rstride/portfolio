---
id: HTB-2026-INTERPRETER
title: Interpreter
excerpt: Unauthenticated XML deserialization in Mirth Connect provides code execution, followed by a double f-string evaluation flaw for privilege escalation.
date: '2026-02-21'
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - DESERIALIZATION
  - CVE-2023-43208
  - F-STRING-INJECTION
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## TL;DR
On **Interpreter**, initial access is obtained by exploiting an unauthenticated XStream deserialization vulnerability (CVE-2023-43208) in NextGen Mirth Connect 4.4.0, yielding a shell as user `mirth`. Post-exploitation database queries allow us to retrieve a hash for user `sedric`, which is cracked (PBKDF2-HMAC-SHA256) to gain SSH access. Privilege escalation is achieved by exploiting a double-evaluation f-string vulnerability in a local Flask application running as root.

---

## Target
- Host: `interpreter.htb`
- IP: `10.129.16.252`

---

## Recon: Open ports and Mirth Connect discovery

An initial network scan reveals:
- **Port 22/tcp**: SSH
- **Port 80/443/tcp**: HTTP/HTTPS hosting NextGen Mirth Connect Administrator
- **Port 6661/tcp**: Mirth Connect internal communications

Analyzing the JNLP file from the web administrator portal confirms the version is NextGen Mirth Connect 4.4.0, which is vulnerable to unauthenticated XML deserialization.

---

## Initial Foothold: XStream Deserialization (CVE-2023-43208)

The version of Mirth Connect is vulnerable to CVE-2023-43208, a bypass of the XStream deserialization fix. The endpoint accepts raw XML payloads without authentication.

Using XStream deserialization gadget chains, we trigger a shell execution that connects back to our listener. We obtain a shell as user `mirth`.

---

## User Access: Database extraction & PBKDF2 hash cracking

We investigate the application properties at `/usr/local/mirthconnect/conf/mirth.properties`. We retrieve the database credentials for MariaDB: `MirthPass123!`.

Connecting to the database, we query the `PERSON` table and extract the hash for the user `sedric`. The hash is stretched using PBKDF2-HMAC-SHA256 with 600,000 iterations. We crack the hash using John/Hashcat to reveal the password: `snowflake1`. We connect via SSH as `sedric`.

---

## Privilege Escalation: Python f-string Double Evaluation

Local enumeration reveals a Flask application running as root on local port 54321: `/usr/local/bin/notif.py`. It parses incoming patient records and evaluates them dynamically using double f-string formatting inside `eval()`:

```python
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old"
try:
    return eval(f"f'''{template}'''")
```

Because of this double evaluation, wrapping Python code inside curly braces `{}` triggers execution. The script enforces a regex to restrict characters, blocking spaces and semi-colons.

We bypass this filter by base64-encoding our command and invoking it via `__import__("os").popen()`:

```python
# Payload
{__import__("os").popen(__import__("base64").b64decode("aW5zdGFsbCAtbyByb290IC1tIDQ3NTUgL2Jpbi9iYXNoIC90bXAvLnNo").decode()).read()}
```

We send the XML payload to local port 54321, spawning a SUID root bash shell at `/tmp/.sh`. We run it to obtain root access.

---

## Defensive notes / remediation

### Fix
- Upgrade NextGen Mirth Connect to a patched version (4.4.1+).
- Do not use `eval()` with f-strings to format strings containing user input.
- Avoid exposing critical administrative services on loopback ports without authentication.

### Monitoring / detection ideas
- Monitor XML payloads for XStream signature gadgets (like `java.lang.ProcessBuilder`).
- Watch for executions of SUID binaries spawned in temporary folders.

---

## Lessons learned
- Secure password hashing (PBKDF2 with high iterations) is still vulnerable if weak passwords are used.
- Python `eval()` combined with dynamic formatting leads to trivial command injection.

---

## Appendix: Timeline summary
1. Recon -> Identify exposed Mirth Connect 4.4.0.
2. Foothold -> Execute exploit for CVE-2023-43208 to get shell as `mirth`.
3. User -> Dump MariaDB database, crack PBKDF2 hash, SSH as `sedric`.
4. Privilege Escalation -> Leverage f-string double evaluation on port 54321 to get root.

---
