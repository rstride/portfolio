---
id: HTB-2026-BROWSED
title: Browsed
excerpt: "Browsed turns a server-side browser extension into access to an internal app, then crosses an arithmetic-evaluation boundary and a privileged Python import boundary."
date: '2026-01-10'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - SSRF
  - COMMAND-INJECTION
  - CACHE-POISONING
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## Three execution contexts

The lab chain is **extension upload → backend Chrome requests → internal Gitea and Flask source → Bash arithmetic injection → shell as `larry` → writable Python bytecode cache → sudo-run tool → root**. The extension executes inside a browser worker, the Bash helper under the web application's account, and the final Python script under sudo. A network response from an internal host is not yet code execution; neither is a writable cache file automatically accepted by Python.

`browsed.htb` is the authorized target. `<ATTACKER_URL>` represents a lab-controlled receiver. The examples are small diagnostics; the original extension archive, callback, and bytecode payload are not reproduced.

## Follow the browser's network position

External TCP enumeration identifies SSH and HTTP. The public site lets visitors upload browser extensions for a backend validation run. That upload is a route into a server-side Chrome process. Inspect its test output and errors: they expose navigation to an internal host, `browsedinternals.htb`, which hosts a Gitea repository and a Flask application. The internal name must be resolved from the **browser worker's** environment; a local workstation's inability to reach it is expected.

A Chrome Manifest V3 extension can run a background service worker. Its `host_permissions` control the destinations the worker may request. A content script and a background worker have different request rules, so identify which context actually runs the code. A minimal lab diagnostic would request a harmless page from the internal host and send only its status or a short marker to `<ATTACKER_URL>`. Confirm both that the extension executed and that it could read the response. A connection to the receiver alone shows only egress; it does not prove internal response access. The [Chrome extension network-request guidance](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) explains permissions and contexts.

Once the internal Gitea instance is reachable, examine the published application source. The Flask route `/routines/<rid>` passes `rid` as an argument to `routines.sh`. The script chooses maintenance operations with numeric comparisons like:

```bash
if [[ "$1" -eq 0 ]]; then
    # approved routine
fi
```

The relevant boundary is not a string-to-number conversion in Flask; it is Bash arithmetic interpretation of attacker-supplied text in a numeric comparison. Repository read permission and route reachability are separate questions. Confirm the extension can reach the Flask service's loopback or internal address before assuming it can invoke the route.

## Why the Bash comparison is dangerous

Bash evaluates both sides of `-eq` arithmetically. Depending on the value and shell version, arithmetic evaluation may resolve variables and array subscripts, whose contents can cause additional evaluation. The [Bash arithmetic documentation](https://www.gnu.org/software/bash/manual/html_node/Shell-Arithmetic.html) describes the expression language. The mistake is treating a user-controlled `rid` as an integer without validating it as a decimal value first. Quoting `"$1"` protects some shell word splitting, but it does not turn arithmetic evaluation into a strict integer parser.

A controlled check should first submit `0` and observe the expected routine. Next use a non-numeric expression whose effect is limited to an observable harmless marker, and compare the two results. Record the exact route request, the helper invocation, and the identity of any resulting process. The lab's documented chain obtains a shell as `larry`; the sample comparison above explains the input-to-sink route but is not itself a complete exploit transcript. If a candidate returns only an error, consider Flask path encoding, shell parsing, array handling, and whether the request reached the script. A successful HTTP response alone says nothing about the OS identity.

The best repair is to reject anything except a narrow allowlist such as `0`, `1`, `2`, or `3` before calling Bash, then compare an already parsed integer. Use a typed dispatch in the application or avoid passing user text to the shell at all. Removing only one metacharacter would leave the interpretation boundary in place.

## Inspect the sudo-run Python tool

After obtaining `larry`, run `id` and `sudo -l`. The relevant sudo rule names **`/opt/extensiontool/extension_tool.py`** as the root-run command. The exact path matters because sudo matches the requested executable. Inspect the script's imports, interpreter version, working directory, source file ownership, and all parent directories. It imports `extension_utils.py` from its directory. The source file is root-owned, but `/opt/extensiontool/__pycache__/` is writable by ordinary users. That shifts control from readable source to cached executable bytecode.

Python commonly caches imported modules as `.pyc` files under `__pycache__`. An import may reuse a cache only if its filename, interpreter magic, invalidation mode, timestamp/size or hash, and source relationship satisfy the interpreter's checks. A writable directory alone is insufficient. The [Python import reference](https://docs.python.org/3/reference/import.html#cached-bytecode-invalidation) describes the checks. On this lab's interpreter, the relevant cache is named for `extension_utils` and CPython 3.12. A privileged run may populate the cache, after which an attacker who controls the directory can replace its contents while retaining a header that the interpreter accepts.

Do not use a guessed `.pyc` generated on a different Python version. For an authorized replay, record `python3 --version`, the exact sudo command, the module search path, the source file's size and modification time, and the cache header. Use a harmless diagnostic that writes a marker showing the effective UID when the module is imported. Only a root-owned marker after the sudo invocation demonstrates that the privileged process accepted the modified cache. If Python regenerates the cache from source, examine the invalidation metadata and import path instead of concluding the directory is safe.

## Repair and regression checks

Isolate uploaded extensions in workers with egress rules that block internal repositories, loopback applications, and metadata services. Give them only the host permissions required by the product, and verify that approved extension checks still work. Ensure internal Gitea and Flask services are reachable only by intended principals, even if a browser worker is compromised.

Parse the routine ID in the web app as a small enumerated value and use fixed commands. Remove unnecessary sudo delegation; if the Python tool must run privileged, make its source, cache, search path, and every parent directory administrator-owned and unwritable to the caller. A regression test should show ordinary routine IDs work, expression-shaped IDs are rejected, internal browser requests fail, and a low-privilege user cannot influence code imported by the privileged tool. Monitor worker requests to internal hosts, unexpected writes to cache directories, and a write followed by a sudo execution of the tool.
