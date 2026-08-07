---
id: HTB-2026-EIGHTEEN
title: Eighteen
excerpt: Password spraying provides WinRM access, then the dMSA BadSuccessor technique exposes the administrator NTLM hash.
date: '2025-11-15'
tags:
  - WRITEUP
  - HACKTHEBOX
  - WINDOWS
  - EASY
  - DMSA
  - BADSUCCESSOR
  - KERBEROS-PAC
category: WRITEUP
platform: HACKTHEBOX
target_os: WINDOWS
difficulty: EASY
severity: LOW
icon: Terminal
author: '0x7CC'
---

## TL;DR
On **Eighteen**, initial access is obtained via password spraying, revealing valid credentials for user `adam.scott`. Privilege escalation exploits **BadSuccessor**, a novel attack vector targeting Delegated Managed Service Accounts (dMSA) on Windows Server 2025, which allows extracting the Domain Administrator's NTLM hash from Kerberos ticket PAC Previous Keys.

---

## Target
- Host: `eighteen.htb`
- IP: `10.129.7.99`

---

## Recon: Active Directory user enumeration

### Nmap Scan
- **Port 80/tcp**: IIS Web Server
- **Port 1433/tcp**: Microsoft SQL Server 2022

Using Kerbrute to enumerate valid Active Directory usernames, we identify several accounts:
- `administrator`
- `adam.scott`
- `svc_pwn`

---

## Initial Foothold: Password spraying & WinRM

We spray common passwords against the discovered accounts:

```bash
crackmapexec smb 10.129.7.99 -u adam.scott -p 'iloveyou1' -d eighteen.htb
```

The credentials are valid, and we access the Domain Controller via WinRM:
- Username: `adam.scott`
- Password: `iloveyou1`

We retrieve the user flag from `/Users/adam.scott/Desktop/user.txt`.

---

## Privilege Escalation: BadSuccessor dMSA Attack

Windows Server 2025 introduces Delegated Managed Service Accounts (dMSAs) that can succeed predecessor accounts via the `msDS-ManagedAccountPrecededByLink` attribute. This attributes preserves "Previous Keys" in Kerberos ticket PAC data.

Since our user has CreateChild permissions on staff OUs, we execute the BadSuccessor attack:

1. Create a delegated MSA linked to the Administrator account.
2. Request a Kerberos ticket for the newly created dMSA.
3. Extract the "Previous Keys" containing the Administrator's NTLM hash.

We run the automation script:

```powershell
. .\Invoke-BadSuccessor.ps1
Invoke-BadSuccessor
```

We extract the ticket using Impacket's `getST.py` with the `-dmsa` flag:

```bash
proxychains4 getST.py 'eighteen.htb/Pwn$:Password123!' \
    -dmsa -self -impersonate 'attacker_dMSA$' \
    -dc-ip 10.129.7.99
```

The output leaks the Administrator NTLM hash:
```text
[*] Previous keys:
[*] EncryptionTypes.rc4_hmac:0b133be956bfaddf9cea56701affddec
```

We use this hash to perform a DCSync attack and read the root flag from the Administrator's desktop.

---

## Defensive notes / remediation

### Fix
- Audit Active Directory OU write permissions to restrict unprivileged users from creating dMSAs.
- Disable RC4 encryption type support in Kerberos authentication policies to mitigate Previous Keys leakage.

### Monitoring / detection ideas
- Alert on changes to the `msDS-ManagedAccountPrecededByLink` attribute on critical administrator objects.
- Monitor ticket requests containing dMSA delegation attributes.

---

## Lessons learned
- New operating systems (Windows Server 2025) introduce new attack surfaces like dMSA links.
- PAC data must be protected against legacy encryption protocols.

---

## Appendix: Timeline summary
1. Recon -> Enumerate AD users and spray passwords.
2. Foothold -> Access system via WinRM.
3. Privilege Escalation -> Abuse Windows Server 2025 dMSA configuration to extract Administrator NTLM hash.

---
