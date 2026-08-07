---
id: "HTB-2025-011"
title: "Signed"
excerpt: "Sur Signed, un password spraying sur le compte MSSQL permet une RCE, puis l'extraction du hash de service sert à forger un Silver Ticket Kerberos."
date: "2025-10-11"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MSSQL", "KERBEROS", "SILVER-TICKET", "MEDIUM"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "ShieldAlert"
author: "0x7CC"
published: true
---

## TL;DR
Sur **Signed**, l'accès initial est obtenu par password spraying sur le compte de service MSSQL. L'élévation s'effectue en extrayant le hash du compte de service pour forger un Silver Ticket Kerberos et accéder au contrôleur de domaine avec les droits de Domain Admin.

---

## Cible
- Host : `signed.htb`
- IP : `10.129.11.109`

---

## Recon : Accès SQL
Le port 1433 est ouvert. Le spray de mots de passe révèle des identifiants valides pour le compte de service SQL.

---

## Accès Initial : RCE MSSQL
Nous activons `xp_cmdshell` pour exécuter des commandes et obtenir un shell initial.

---

## Élévation de privilèges : Forge de Silver Ticket
En récupérant le hash NTLM du compte de service associé à un Service Principal Name (SPN), nous forgeons un Silver Ticket pour le service CIFS du DC :

```text
mimikatz # kerberos::golden /domain:signed.htb /sid:S-1-5-21-... /rc4:database_hash /user:Administrator /service:cifs /target:dc.signed.htb
```

Le ticket est injecté en mémoire, nous donnant l'accès administrateur sur le DC.

---

## Notes défensives / remédiation

### Correctif
- Utiliser des mots de passe robustes pour les comptes de service.
- Activer l'armoring Kerberos.

---

## Annexe : Résumé de la timeline
1. Connexion SQL par spraying.
2. RCE et dump de hash.
3. Forge de Silver Ticket pour compromettre le DC.

---
