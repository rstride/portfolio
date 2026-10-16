---
id: HTB-2026-CONVERSOR
title: Conversor
excerpt: "Conversor turns an uploaded XSLT stylesheet into a file write, scheduled code execution, and a user pivot; a separate sudo configuration choice then grants root execution."
date: '2025-10-25'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - EASY
  - XSLT-INJECTION
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

## What the chain teaches

Conversor begins with a web converter for XML and XSLT. A visitor can register, upload a document and a stylesheet, and ask the server to transform one with the other. That feature is the entry point. The supplied stylesheet is a program interpreted by the server, so the security question is which filesystem and network operations its XSLT engine permits.

The lab path is: **web account → XSLT file write → scheduled Python execution as `www-data` → local password hash → SSH as `fismathack` → root through `needrestart`**. The accounts in that sentence have distinct permissions. Merely placing a script on disk does not give a shell; the scheduled job must execute it. Neither the web login nor the application shell implies the later SSH login.

Use the commands only in the authorized machine. Here `conversor.htb` is the target hostname; local paths in examples refer to a workstation unless a section says otherwise. The password and callback address are intentionally omitted.

## Find the transformation boundary

A TCP scan identifies SSH and HTTP. The HTTP service redirects to `conversor.htb`, so resolve that name to the lab IP before browsing. A hostname matters because the virtual host may route requests differently from the bare IP. The site offers registration and a downloadable example stylesheet. Submitting ordinary XML and that stylesheet first gives a positive control: it establishes the expected multipart field names, authentication cookie, and normal output.

The About page offers `source_code.tar.gz`. Inspecting the application source is more useful than guessing an exploit from the Apache banner. The `/convert` handler saves both uploads, parses the XML with entity resolution and network access disabled, then parses the uploaded stylesheet and constructs an `etree.XSLT` transform. These are separate parsers with separate security controls. Hardening XML entity expansion does not automatically restrict the stylesheet's ability to read or write through XSLT extensions. The [lxml XSLT documentation](https://lxml.de/xpathxslt.html) describes the transformation API and [XSLT access control](https://lxml.de/api/lxml.etree.XSLTAccessControl-class.html).

The source bundle's deployment notes describe a scheduled task processing Python files in `/var/www/conversor.htb/scripts/` as `www-data`. That provides a concrete destination for a file-write test. Read the scheduler line carefully: the user column decides the execution identity. A root-owned `/etc/crontab` file does not mean every command within it runs as root.

## Turn stylesheet execution into a controlled file write

An XSLT stylesheet may use extension elements such as `exsl:document` to create a secondary output file. In this lab the uploaded stylesheet is not subject to an effective write restriction. A minimal diagnostic writes a harmless marker to the script directory; it does not require a reverse shell:

```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:exsl="http://exslt.org/common"
  extension-element-prefixes="exsl">
  <xsl:template match="/">
    <exsl:document href="/var/www/conversor.htb/scripts/probe.py" method="text">
      <xsl:text>from pathlib import Path&#10;Path('/tmp/conversor-probe').write_text('executed')&#10;</xsl:text>
    </exsl:document>
    <ok>converted</ok>
  </xsl:template>
</xsl:stylesheet>
```

This is an **illustrative diagnostic**, not a captured lab request. Upload it with a simple XML document through the authenticated converter. If the response says the conversion succeeded, that only confirms the transform ran. The stronger check is that `probe.py` appears in the intended directory and, after the scheduler interval, `/tmp/conversor-probe` appears with the expected contents. The marker shows that the scheduled consumer executed the file. To establish its identity, a lab-only diagnostic could write the effective UID to a protected evidence file; the documented scheduler configuration indicates `www-data`.

If the output file does not appear, inspect the stylesheet namespace, whether the extension element is enabled, the resolved destination, and the web process's write permission. If it appears but never runs, check the scheduler line, filename pattern, Python syntax, and whether the job was active. These are different failure points. An error about `document()` reading a local URI is not evidence that `exsl:document` writes are blocked: the former loads an input document, while the latter writes an output document.

The published lab chain uses the same write primitive to place Python that gives an application shell. A callback requires a listener, an address reachable from the target, and careful treatment of quoting and execution delay. A harmless marker is preferable when verifying the vulnerability because it isolates the XSLT and scheduler boundaries.

## From application access to `fismathack`

The application configuration points to a SQLite database at `/var/www/conversor.htb/instance/users.db`. The archive downloaded from the site may contain an empty development database; the live file must be checked from the application context. Once code executes as `www-data`, read the live SQLite schema and the relevant account row with `sqlite3` if installed. Record only the hash format, username, and whether the application account can read the file. Do not mistake a hash for a reusable plaintext password.

The machine stores an MD5-based password hash for `fismathack`. Offline guessing can recover a weak password despite the hash; a successful guess still needs a separate authentication test. Verify SSH accepts the candidate and run `id` in the new session. That check marks the transition from the web process to the OS user. Hash extraction does not itself change privileges, and an MD5 string found in a public source bundle would not prove it belongs to the live account.

## Why `needrestart` grants root execution

From the `fismathack` session, `sudo -l` identifies permission to run `/usr/sbin/needrestart` without a password. The relevant option is `-c`, which chooses the program's configuration. The configuration is Perl code, and the rule lets this user point the privileged program at a file they control. The issue is therefore the trust boundary around the config path, not the fact that a package scanner exists. The [needrestart manual](https://manpages.debian.org/bookworm/needrestart/needrestart.1.en.html) documents `-c`.

For a controlled proof, place a Perl config file in a directory writable by `fismathack` and have it print the effective identity. Then invoke the exact sudo-allowed binary with that file:

```bash
printf '%s\n' 'print "effective UID: $>\n";' > /home/fismathack/probe.conf
sudo /usr/sbin/needrestart -c /home/fismathack/probe.conf
```

The dollar sign is written literally by single-quoted shell text; Perl expands `$>` when loading the config. An effective UID of 0 shows the configuration ran in root context. The file is an illustrative diagnostic. The original root transition used executable configuration, but its secret output is unnecessary to teach the mechanism. If this invocation fails, check the precise sudo rule, whether arguments are restricted, and the utility version before drawing a conclusion.

## Repair and verify each boundary

Run untrusted stylesheets with `XSLTAccessControl` denying filesystem and network access, or use a transformation service isolated from sensitive paths. Store uploads outside executable directories and normalize any filenames before joining paths. Restrict scheduled-script directories to deployment administrators, and replace execution of every matching uploaded file with a fixed, reviewed program. A retest should submit an approved transform, then attempt a secondary file write and confirm it is denied.

Move the application database behind appropriate filesystem permissions, use a modern password hash, and rotate credentials exposed or reused between the site and SSH. Remove the blanket sudo delegation, or make `needrestart` load only administrator-owned configuration. Retest with a user-controlled config path and check that the privileged command refuses it while an approved maintenance run still succeeds. The decisive evidence is a denied write or execution at each boundary, not merely a patched version string.
