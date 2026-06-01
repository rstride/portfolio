---
id: "HTB-2026-DARKZERO"
title: "DarkZero"
excerpt: "Sur **DarkZero**, nous réalisons une attaque Active Directory à partir d'un compte utilisateur basique. Nous nous connectons au serveur SQL de la forêt principa"
date: "2025-10-04"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "HARD", "CROSS-FOREST", "MSSQL-LINK", "CVE-2024-30088"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "HARD"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — DarkZero (Windows) Write-Up : Confiance cross-forest → RCE SQL lié → LPE CVE-2024-30088 → Délégation TGT

## TL;DR
Sur **DarkZero**, nous réalisons une attaque Active Directory à partir d'un compte utilisateur basique. Nous nous connectons au serveur SQL de la forêt principale, découvrons un serveur lié vers la forêt distante avec les droits sysadmin, et l'exploitons pour exécuter des commandes. L'élévation de privilèges vers SYSTEM s'effectue via CVE-2024-30088, et la forêt principale est compromise via la délégation TGT.

---

## Cible
- Host : `darkzero.htb` / `darkzero-ext`
- IP : `10.129.4.91`

---

## Recon : Découverte du serveur SQL lié
Nous débutons avec les identifiants :
- Utilisateur : `john.w`

Nous nous connectons à l'instance locale MSSQL de `DC01`. L'énumération montre un lien vers `DC02` (`darkzero.ext`) nommé `SQL07` avec les droits sysadmin.

---

## Accès Initial : RCE sur le serveur lié
Nous activons `xp_cmdshell` sur `DC02` via la liaison de serveurs SQL :

```sql
EXEC ('sp_configure ''show advanced options'', 1; reconfigure;') AT [SQL07];
EXEC ('sp_configure ''xp_cmdshell'', 1; reconfigure;') AT [SQL07];
```

Nous exécutons un reverse shell et obtenons une session en tant que `darkzero-ext\svc_sql`.

---

## Élévation de privilèges : Noyau Windows LPE (CVE-2024-30088)
Le serveur `DC02` tourne sous Windows Server 2022 et est vulnérable à CVE-2024-30088.

Nous exécutons l'exploit local pour intercepter le token de Winlogon :
```text
msf > use exploit/windows/local/cve_2024_30088_authz_basep
```
Nous obtenons un shell `NT AUTHORITY\SYSTEM` et extrayons le hash de l'administrateur.

---

## Notes défensives / remédiation

### Correctif
- Auditer les configurations des serveurs SQL liés et éviter de déléguer des privilèges sysadmin.
- Désactiver `xp_cmdshell`.
- Appliquer les correctifs de sécurité pour CVE-2024-30088.

---

## Annexe : Résumé de la timeline
1. Accès SQL avec les identifiants utilisateur.
2. RCE via le serveur SQL lié `SQL07`.
3. Élévation SYSTEM via CVE-2024-30088.
4. DCSync et compromission finale du domaine.

---