---
id: HTB-2025-011
title: Signed
excerpt: Password spraying against the MSSQL service account enables code execution, then its hash is used to forge a Kerberos Silver Ticket.
date: '2025-10-11'
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - MSSQL
  - KERBEROS
  - SILVER-TICKET
  - MEDIUM
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: MEDIUM
severity: MEDIUM
icon: ShieldAlert
author: '0x7CC'
---

## TL;DR
On **Signed**, initial access starts with a password spray to compromise an MSSQL service account. Post-exploitation reveals the Kerberos Service Principal Name (SPN) configuration. Privilege escalation is achieved by forging a Kerberos Silver Ticket to access the Domain Controller with Domain Admin rights.

---

## Target
- Host: `signed.htb`
- IP: `10.129.11.109`

---

## Recon: Sprayed credentials and MSSQL access

### Ports Scan
- **Port 1433/tcp**: Microsoft SQL Server

We perform a password spray and identify valid credentials for the MSSQL service account. We log in to the database server.

---

## Initial Foothold: MSSQL exploitation

Once connected, we query domain objects and execute commands via `xp_cmdshell` to gain shell access to the database host. We dump Kerberos tickets and locate service keys.

---

## Privilege Escalation: Kerberos Silver Ticket Forgery

We identify that the database service is configured with a Service Principal Name (SPN). By extracting the service account's NTLM password hash from the local system, we can forge Kerberos Silver Tickets.

A Silver Ticket allows us to forge service tickets for specific services (like CIFS or LDAP) on the Domain Controller without communicating with the Key Distribution Center (KDC).

We forge a ticket for the CIFS service:

```bash
mimikatz # kerberos::golden /domain:signed.htb /sid:S-1-5-21-... /rc4:database_hash /user:Administrator /service:cifs /target:dc.signed.htb
```

The forged ticket is injected into memory, granting us administrative access to the Domain Controller filesystem. We retrieve the flags.

---

## Defensive notes / remediation

### Fix
- Ensure service accounts use strong, randomly generated passwords.
- Limit permissions of accounts configured with Service Principal Names.
- Implement Kerberos armoring and monitor ticket requests for anomalous structures.

### Monitoring / detection ideas
- Alert on Kerberos ticket requests with unusual lifetimes or encryption algorithms.
- Monitor usage of forged tickets on network file shares.

---

## Lessons learned
- Service account compromises frequently lead to Kerberos delegation and ticket forgery attacks.
- Strong password hygiene is vital for accounts associated with SPNs.

---

## Appendix: Timeline summary
1. Recon -> Spray passwords, gain MSSQL access.
2. Foothold -> Execute shell via database service.
3. Privilege Escalation -> Extract service hash and forge Kerberos Silver Ticket for DC.

---
