---
id: HTB-2026-INTERPRETER
title: Interpreter
excerpt: "Mirth Connect deserialization, password reuse, and a second evaluation of Python f-strings: explain the transitions and remove the eval boundary."
date: '2026-02-21'
updated: "2026-10-13"
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

## Chain and prerequisites

Interpreter's account records Mirth Connect 4.4.0, execution as `mirth`, database access, recovery of a `sedric` password, SSH access, and a root-running notification service evaluating user input.

The initial exploit XML and stored hash record are absent. Endpoint, gadget, salt, encoding, and iteration count are not independently established here. Do not copy the reported PBKDF2 parameters into a cracking command without inspecting the actual record.

## Mirth Connect: version and process context

The target is `interpreter.htb`; the account identifies the version through an administrator JNLP file. An exposed version is a lead. Verify the installed application, patch state, and reachable deserialization path.

CVE-2023-43208 concerns unauthenticated execution before Mirth Connect 4.4.1 after an incomplete earlier fix. The [vendor release notes](https://github.com/nextgenhealthcare/connect/wiki/4.4.1---What's-New) provide the patch reference; the [discoverer's description](https://docs.horizon3ai.com/knowledge_base/weaknesses/H3-2023-0027/) identifies execution in the service-user context.

The reported `mirth` shell is not automatically root. Reading /usr/local/mirthconnect/conf/mirth.properties crosses a separate filesystem boundary. Database credentials can permit reading hashes without establishing another user's SSH access.

## Password recovery and reuse

The account reports querying `PERSON`, recovering `sedric`'s password, and reusing it for SSH. Strong hashing increases guessing cost, not the strength of a weak password. Record the serialized format and parameters before choosing a tool mode; separately demonstrate acceptance by the second service.

Recovered secrets are omitted because their values do not explain the privilege transition.

## The second f-string turns data into syntax

The retained excerpt from `/usr/local/bin/notif.py`, described as root-running behind a local service, is:

```python
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old"
return eval(f"f'''{template}'''")
```

The first formatting inserts untrusted strings; `eval` then parses them as a new f-string. Braces that were data become Python expressions. Blocking spaces or semicolons does not remove this design flaw. Python warns about user-supplied input through [eval](https://docs.python.org/3/library/functions.html#eval).

The original encoded shell payload and complete filter are not retained as a verified bypass. Root execution is reported; replay additionally requires the schema, service reachability, filter, and runtime identity. Loopback does not make local-user input trustworthy.

## Remove evaluation and verify

This illustrative replacement validates a birth year separately, computes age as data, and formats once:

```python
age = datetime.now().year - year_of_birth
message = f"Patient {first} {last} ({gender}), {age} years old"
```

`datetime` is imported and `year_of_birth` has passed type/range checks. This removes evaluation without implementing all validation or authorization.

Upgrade to a maintained Mirth release containing the fix, limit database and config-file access, rotate exposed credentials, and remove root rights from the notification service.

In a controlled test, submit literal `{1+1}` in a name: it must remain data or be rejected, never become `2`. Verify normal notifications, denied unauthorized callers, and an unprivileged process identity. Monitor unexpected child processes from these services and temporary SUID creation, correlated with requests rather than a string pattern alone.
