---
id: HTB-2026-GAVEL
title: Gavel
excerpt: "Exposed source, SQL injection, dynamic PHP rules, and a privileged rule runner: tracking the distinct controls that fail on Gavel."
date: '2025-11-29'
updated: "2026-10-13"
tags:
  - WRITEUP
  - HACKTHEBOX
  - LINUX
  - MEDIUM
  - SQLI
  - RUNKIT
  - SUID-EXECUTION
category: WRITEUP
platform: HACKTHEBOX
target_os: LINUX
difficulty: MEDIUM
severity: MEDIUM
icon: Terminal
author: '0x7CC'
---

## Chain and evidence

The Gavel account describes source recovery from an exposed `.git`, SQL injection in `inventory.php`, password recovery for `auctioneer`, web execution through auction rules, and root execution through `/usr/local/bin/gavel-util`.

It lacks the complete injection request, query, executable analysis, and runner transcript. Its excerpts support a mechanism discussion, not an independently reproduced chain. Keep source disclosure, database extraction, and credential reuse as separate observations.

## Source disclosure guides database testing

The target is `gavel.htb`, with SSH and a PHP application. A readable Git directory can reveal routes and query construction. It does not itself return database rows: injection still requires a reachable vulnerable query and sufficient database permissions.

The account reports recovery of a bcrypt password for `auctioneer`. This is offline guessing, not reversal of bcrypt. A minimal unauthorized query result distinguishes SQL injection from a secret simply committed to a repository.

An illustrative PDO replacement for a value-based inventory lookup is:

```php
$stmt = $pdo->prepare('SELECT name FROM inventory WHERE id = :id');
$stmt->execute(['id' => $validatedId]);
```

`$pdo` is an existing connection and `$validatedId` a validated identifier. [PDO::prepare](https://www.php.net/manual/en/pdo.prepare.php) separates values from syntax; dynamic table names and sorting expressions need separate allowlists.

## Auction rules are executable code

The account describes an administrator modifying a rule and a bid triggering `runkit_function_add`. The [runkit7 API documentation](https://www.php.net/manual/en/function.runkit7-function-add.php) documents function creation from supplied code. Confirm the lab's actual extension/version rather than silently substituting this API into its source.

An administrator authorized to adjust bidding criteria need not be authorized to write executable PHP. Exploitation requires rule evaluation, suitable write permissions, and reachability of the resulting file. The account reports `www-data` execution and credential reuse as `auctioneer`; saving a rule alone does not demonstrate either transition.

## The privileged runner amplifies the same design

The account identifies `gavel-util` as a SUID YAML rule runner and reports modifying `/opt/gavel/.config/php/php.ini` before a later privileged rule. The ordering matters: a changed file affects only a process that loads it at the relevant time.

A SUID bit alone does not establish that child PHP retains root. Verify ownership, effective UID, privilege handling, loaded configuration and directory writability. Root access is reported without those traces. The shell-creation payloads are omitted rather than presented as a complete recipe.

## Remediation and retest

Exclude `.git` from deployment and web serving; rotate leaked secrets. Parameterize database values and narrow database permissions. Replace executable bidding rules with constrained data and explicitly supported operators.

Retire SUID rule execution or separate privileged operations from untrusted evaluation. Protect interpreter configuration and all parent directories; PHP restrictions do not replace an execution boundary.

Verify that repository paths are inaccessible, injection-shaped input remains data, legitimate auctions work, and rule authors cannot write executable files or interpreter configuration. Monitor Git requests, unexpected PHP writes, runner executions, and configuration changes followed by interpreter startup. This correlation distinguishes the initial leak from escalation.
