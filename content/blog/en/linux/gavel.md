---
id: HTB-2026-GAVEL
title: Gavel
excerpt: "Gavel is an auction application whose exposed source reveals a subtle SQL parser mismatch, executable bidding rules, and a privileged rule-processing daemon."
date: '2025-11-29'
updated: "2026-10-15"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - SQLI
  - RUNKIT
  - PRIVILEGED-DAEMON
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## Attack route and identities

The chain is **readable `.git` → PHP source → inventory SQL injection → `auctioneer` password hash → admin login → PHP rule execution as `www-data` → credential reuse as `auctioneer` → rule submission to `gaveld` → root execution**. The database leak, web code execution, Unix login, and root daemon are separate transitions. The program `gavel-util` is a client for a privileged daemon; describing it simply as a SUID YAML runner misses where the final authority lives.

`gavel.htb` is the lab host. Commands and snippets are illustrative diagnostics. No credential, complete injection URL, flag, or shell payload from another account is copied into this article.

## Let the source lead the investigation

Network enumeration shows SSH and an HTTP auction site. Check whether the deployed web root exposes `.git`, then retrieve only the source needed to inspect routes and database code. A readable repository discloses implementation and perhaps configuration, but it does not by itself return database rows. The inventory handler accepts `sort` and `user_id` parameters. Its PHP builds a column expression from user-controlled text, strips backticks from the `sort` value, wraps it in backticks, and inserts that result into a string passed to `PDO::prepare()`. A separate value is bound for the user ID.

The essential pattern is:

```php
$col = '`' . str_replace('`', '', $sortItem) . '`';
$stmt = $pdo->prepare("SELECT $col FROM inventory WHERE user_id = ?");
$stmt->execute([$userId]);
```

This shortened example is **illustrative**; inspect the lab's full query and branch behavior before testing. The problem is not that binding an ordinary value fails. Identifiers such as column names cannot be supplied by a value placeholder, so `$col` is assembled as SQL syntax. In this case, PDO may emulate prepared statements and parse placeholder characters differently from MySQL when a backslash interacts with a quoted identifier. A crafted `sort` value can shift PDO's view of where a `?` placeholder is; the attacker-controlled `user_id` value then lands in a SQL syntax position after substitution. The [original PDO parser research](https://www.slcyber.io/research/a-novel-technique-for-sql-injection-in-pdos-prepared-statements) describes the mismatch; [PDO::prepare documentation](https://www.php.net/manual/en/pdo.prepare.php) explains emulated preparation and the limits of binding.

For a controlled test, compare a normal `sort` request with an input designed to alter the placeholder count or resulting column expression, then inspect the final SQL or a harmless database value returned. A raw 500 error is not enough to establish data extraction. Record both parameters, the PDO emulation setting, and the query branch; missing any of these makes the result hard to interpret. Disabling emulation can change the failure mode, but the durable fix is to choose column identifiers from a server-side allowlist and bind only values.

The lab uses this route to read a bcrypt hash for `auctioneer`. Hash recovery is an offline password-guessing step, not a reversal of bcrypt. Verify a candidate on the admin login before claiming control of the auction rules. A weak password can be recovered even when bcrypt itself works as designed.

## Follow the rule into PHP execution

An administrator can edit auction rules. The application later treats the rule field as the body of a PHP function using `runkit_function_add`, then evaluates it when a bid is processed. The trust boundary is between business configuration and executable code. Saving a rule is only a state change; a bid must trigger it, and the resulting process identity must be checked. The [runkit function documentation](https://www.php.net/manual/en/function.runkit7-function-add.php) describes dynamically creating a function from supplied code, though the lab's installed extension and API version should be confirmed.

Use a harmless rule that returns a predictable boolean while writing a test marker, then submit a bid that reaches it. The marker and `id` result demonstrate execution as the web process, `www-data`. If the rule is saved but no marker appears, verify publication state, selected auction, bid constraints, and whether the configured rule engine actually ran. An admin role alone does not equal OS execution until the rule is evaluated.

The recovered password also works for Unix user `auctioneer` on the lab host. That reuse needs its own SSH check and `id`. The user's group membership grants access to the local daemon's Unix socket. Root execution does not flow from the password alone; it flows from what the socket service accepts.

## Understand the privileged daemon

`gavel-util submit <file.yaml>` sends a YAML submission to `/var/run/gaveld.sock`. The socket is owned for a seller group, and `gaveld` handles requests as a privileged process. The submitted YAML contains fields such as item metadata and a `rule` containing PHP. The daemon tests the rule with a PHP interpreter and a restrictive configuration under `/opt/gavel/.config/php/php.ini`. That file sets constraints such as `disable_functions` and `open_basedir`. A YAML file reaching the socket proves only submission; the daemon's parser, sandbox invocation, and execution result must be observed separately.

The lab offers two related weaknesses. In one path, an allowed file-write function can change the PHP configuration, so a **later** request launches an interpreter with weaker restrictions. In another, the client supplies a `RULE_PATH` environment variable that the daemon accepts as a different configuration path. Either way, the privileged daemon trusts configuration influenced by a lower-privilege caller. Check the loaded configuration path, whether the daemon restarts or starts a fresh interpreter for each submission, and the effective UID of any side effect. A modified `php.ini` affects only processes that load it after the change. `/tmp` may also differ between the Apache session and daemon because of systemd `PrivateTmp`; a file seemingly missing from a web shell may be present in another mount namespace. Compare actual mounts and process namespaces before assuming the write failed.

A controlled proof should write a harmless root-owned marker to a permitted location and inspect ownership. The presence of a YAML response or a file created as `auctioneer` does not establish root. Do not substitute a SUID-bit claim for the daemon's real execution context.

## Fix and verify

Remove `.git` from the deployed web root. Allowlist inventory sort keys and derive user identity from the session rather than a caller-supplied `user_id`; use database permissions that limit what a failed query can expose. Rotate the recovered account password and stop sharing it between the site and SSH. Replace PHP bidding rules with a constrained expression format that cannot call filesystem or process APIs.

For the daemon, authenticate and authorize socket clients, validate YAML fields, remove arbitrary PHP evaluation, and make interpreter configuration and all parent directories administrator-owned. A sandbox setting should never be writable or selectable by the user whose code it is meant to constrain. Retest repository access, normal inventory sorting, unauthorized sort and user IDs, legitimate bidding, rule submission, and attempted config changes. Monitor `.git` requests, unusual database reads, rule edits followed by PHP file writes, and privileged daemon launches with a changed configuration.
