---
id: HTB-2026-CONVERSOR
title: Conversor
excerpt: "Upload-path traversal, scheduled execution, credential reuse, and needrestart: following the execution identity across each trust boundary."
date: '2025-10-25'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - EASY
  - PATH-TRAVERSAL
  - CRON-HIJACK
  - NEEDRESTART
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: EASY
severity: LOW
icon: Terminal
author: '0x7CC'
---

## Attack chain and evidence

Conversor links an unsafe upload destination to scheduled Python execution, then database credential reuse and a permissive sudo rule. The existing lab account records shells as `www-data`, then `fismathack`, then root. It does not include a complete upload request or the scheduler configuration; the examples below explain the mechanism rather than reproduce a captured session.

A root-owned cron file does not establish that its command runs as root. The relevant evidence is the job's user field, any privilege drop in the command, and the identity of the resulting process. The recorded `www-data` shell supports execution as that account, not an immediate root foothold.

## Enumeration: follow the source to the filesystem

The recorded target is `conversor.htb`, serving HTTP and SSH. An exposed `source_code.tar.gz` gives access to `app.py`. Source disclosure is useful because it connects an input field to the actual write operation:

```python
file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
```

Joining paths does not confine them. If `filename` is client-controlled, `../scripts/pwn.py` can reach a sibling directory; an absolute path can also override the base path. To establish exploitation, record the upload base, normalized destination, write permissions, and the process consuming that file. The excerpt alone does not prove all of those conditions.

## Scheduled execution and the user transition

The lab account identifies `/var/www/conversor.htb/scripts/` as a directory consumed periodically. An uploaded Python file only becomes code execution if the application can write there and the scheduler executes it. In an authorized replay, a harmless marker containing the process identity provides better evidence than merely finding the file.

After obtaining application execution, the account describes reading `users.db`, recovering the `fismathack` password from an MD5 hash, and reusing it for SSH. These are separate controls: database readability, password resistance to guessing, and cross-service password reuse. MD5 recovery does not automatically establish that SSH accepts the password.

## Privilege escalation: executable configuration

The recorded sudo rule permits `/usr/sbin/needrestart` without a password. Its `-c` option selects a configuration file; the configuration uses Perl syntax. This is a delegation issue involving attacker-controlled configuration, not a version-specific exploit demonstrated here. See the [needrestart manual](https://manpages.debian.org/bookworm/needrestart/needrestart.1.en.html).

For a controlled validation, `/home/fismathack/probe.conf` is an illustrative file containing only:

```perl
system('/usr/bin/id');
```

With the recorded rule still in place, the illustrative invocation is:

```bash
sudo /usr/sbin/needrestart -c /home/fismathack/probe.conf
```

An identity printed by the configuration establishes its execution context. A successful utility exit alone does not.

## Fix the boundaries and verify them

- Generate server-side upload names and keep uploads outside executable directories. If preserving names, apply basename sanitization and destination containment checks; account for symlinks. Werkzeug documents [secure_filename and its limitations](https://werkzeug.palletsprojects.com/en/stable/utils/#werkzeug.utils.secure_filename).
- Make scheduled code and its parent directories writable only by deployment administrators. Verify the actual scheduler account and attempt traversal with a harmless file in a test environment.
- Replace the unrestricted sudo delegation with a reviewed operation using fixed, trusted configuration. Confirm the user cannot select another config or modify any loaded dependency.
- Rotate reused credentials and migrate password storage to a supported password-hashing scheme.

Monitor unexpected writes to the scheduled-script directory and sudo invocations selecting nonstandard configuration files. The useful signal is a write followed by execution under another identity, not a filename alone.
