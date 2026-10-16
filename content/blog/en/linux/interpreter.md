---
id: HTB-2026-INTERPRETER
title: Interpreter
excerpt: "Interpreter chains a vulnerable Mirth Connect API, a database password record, and a second evaluation of patient data inside a root-run Python notification service."
date: '2026-02-21'
updated: "2026-10-15"
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

## Separate the three identities

The route is **Mirth Connect 4.4.0 → unauthenticated Java deserialization → shell as `mirth` → database credential → `sedric` password hash → SSH as `sedric` → loopback notification API → f-string evaluation as root**. An application shell, a database connection, an SSH account, and a root service have different rights. The important question at each transition is what evidence shows the new identity.

The examples use `interpreter.htb` as the lab host. Passwords, hashes, payloads that create shells, and flag values are omitted. Code excerpts are reduced to the vulnerable mechanism. The commands are illustrative diagnostics for an authorized replay.

## Identify and enter Mirth Connect

The initial ports include the web interface and SSH; a healthcare messaging listener may also appear. The Mirth administrator download exposes a `webstart.jnlp` file whose referenced libraries reveal the Connect version. A JNLP version is a useful lead, but it should be checked against the installed application and patch state. The lab presents Mirth Connect 4.4.0. CVE-2023-43208 concerns unauthenticated deserialization reachable through the Mirth API before the 4.4.1 fix. The [vendor's release notes](https://github.com/nextgenhealthcare/connect/wiki/4.4.1---What's-New) document the repair, and the [original vulnerability research](https://docs.horizon3ai.com/knowledge_base/weaknesses/H3-2023-0027/) explains the input path.

The vulnerable server parses untrusted XML into Java objects using XStream. If the allowed object graph can trigger behavior during reconstruction, parsing the request can execute code before authentication. This is an input-to-object-instantiation boundary, not a password bypass. Use an examined proof of concept suited to the exact build, and record the request path, response, and effective process identity. The lab reports execution as `mirth`. A successful HTTP code alone does not prove command execution; a controlled `id` in the resulting process does.

If the exploit fails, check the deployed version, route reachability, exact request content type, proxy rewriting, and whether a vendor or distribution patch has been backported. Do not infer exposure from a version string without confirming the deserialization route.

## Follow the application credential into the database

A `mirth` shell can read its application configuration under `/usr/local/mirthconnect/conf/mirth.properties` in this lab. It contains database connection settings. A database password allows a SQL connection as the configured database user; it does not grant the Linux account `sedric`. Confirm database host, name, user, and accepted login before querying. In the lab, the relevant tables are `PERSON` and `PERSON_PASSWORD`: the former maps an ID to username `sedric`, and the latter holds that ID's stored password record. An illustrative read is:

```sql
SELECT p.ID, p.USERNAME, pp.PASSWORD
FROM PERSON AS p
JOIN PERSON_PASSWORD AS pp ON pp.PERSON_ID = p.ID
WHERE p.USERNAME = 'sedric';
```

Do not publish the returned value. The stored field is Base64-encoded salt plus derived key, not a plaintext password. The lab's Mirth code uses PBKDF2-HMAC-SHA256, with an eight-byte salt and 600,000 iterations in the examined build. Those parameters come from its implementation, so verify them against the installed JAR before converting a record for an offline tool. Decode Base64, split the first eight bytes as salt, keep the remaining derived key bytes, then encode each component in the format the selected mode expects. A malformed split can make a correct password appear impossible. A recovered candidate must be tested against SSH, followed by `id`, to establish the `sedric` transition.

The database connection also exposes Mirth channel definitions. They explain how healthcare messages reach an internal notification service, but application-channel configuration and the `sedric` password are different findings. A channel description alone does not give a root shell.

## Locate and test the root notification service

From the `sedric` SSH session, inspect listening sockets and the service unit. The lab has a Python service on `127.0.0.1:54321` that runs as root and accepts `POST /addPatient`. Its script `/usr/local/bin/notif.py` is readable in this account's group context; the earlier `mirth` account cannot read it. The handler expects XML with a `patient` element and fields including `firstname`, `lastname`, `birth_date`, `sender_app`, `timestamp`, and `gender`. It also checks the remote address, so direct access from the workstation can return 403 even though the route works locally. Use `curl` from the host or an SSH local forward from the authenticated session. A GET returning 405 shows a route exists but does not test the handler.

The critical excerpt is:

```python
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old"
return eval(f"f'''{template}'''")
```

The first f-string inserts patient strings as data. Then `eval` constructs and parses a **new** f-string from that combined text. Curly braces inside a name become expressions during the second pass. The input regex permits braces and other characters needed for an expression, even though it rejects some shell metacharacters. The trust boundary is Python evaluation, not a traditional shell command parser. The [Python `eval` documentation](https://docs.python.org/3/library/functions.html#eval) warns against evaluating untrusted strings.

A harmless test submits `{2+3}` as a first name with otherwise valid XML and birth date. If the response contains `5` in place of the literal braces, it proves expression evaluation. If the service returns `[INVALID_INPUT]` or `[INVALID_DOB]`, correct field syntax before making claims about the sink. If it returns an evaluation error, inspect the quoting and expression. Because the service runs as root, a subsequent expression could have root effects; the benign arithmetic test already establishes the unsafe boundary without reproducing a shell payload.

## Fix and verify

Upgrade Mirth Connect to a maintained release containing the deserialization fix, restrict access to configuration and database records, and rotate exposed credentials. Treat password reuse as a separate issue; use strong independent passwords and protect hashes with current parameters. Run the notification service under an unprivileged account and authorize its callers even on loopback.

Remove the second evaluation entirely. Parse and validate the birth year, compute the age as a number, and interpolate each user field **once** into a normal string. A regression test should submit `{2+3}` and see those literal characters or a validation rejection, never `5`. Also verify normal patient notifications, rejection of remote callers, and the restarted service's actual OS identity. Monitor unusual child processes from Mirth and the notification service, correlated with incoming requests.
