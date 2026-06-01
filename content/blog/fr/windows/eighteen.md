---
id: "HTB-2026-EIGHTEEN"
title: "Eighteen"
excerpt: "Sur **Eighteen**, l'accès initial est obtenu via password spraying sur l'utilisateur `adam.scott`. L'élévation de privilèges exploite **BadSuccessor**, un vecte"
date: "2025-11-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "DMSA", "BADSUCCESSOR", "KERBEROS-PAC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Eighteen (Windows) Write-Up : Attaque dMSA BadSuccessor

## TL;DR
Sur **Eighteen**, l'accès initial est obtenu via password spraying sur l'utilisateur `adam.scott`. L'élévation de privilèges exploite **BadSuccessor**, un vecteur d'attaque ciblant les Delegated Managed Service Accounts (dMSA) sur Windows Server 2025. Cela permet d'extraire le hash NTLM de l'administrateur depuis les clés précédentes du PAC Kerberos.

---

## Cible
- Host : `eighteen.htb`
- IP : `10.129.7.99`

---

## Recon : Énumération Active Directory
Le scan de ports montre :
- **Port 80/tcp** : HTTP (IIS)
- **Port 1433/tcp** : MSSQL

L'énumération avec Kerbrute révèle l'utilisateur `adam.scott`.

---

## Accès Initial : WinRM
Nous effectuons un spray de mots de passe et trouvons les accès pour `adam.scott` (`iloveyou1`).

Nous nous connectons via Evil-WinRM.

---

## Élévation de privilèges : Attaque BadSuccessor sur dMSA
Windows Server 2025 supporte les comptes dMSA liés par l'attribut `msDS-ManagedAccountPrecededByLink`.

En ayant les permissions de création dans l'OU, nous lions un nouveau dMSA à l'Administrateur, demandons un ticket Kerberos, et extrayons le hash NTLM de l'administrateur contenu dans les clés de chiffrement précédentes :

```text
[*] Previous keys:
[*] EncryptionTypes.rc4_hmac:0b133be956bfaddf9cea56701affddec
```

Ce hash nous permet de réaliser un DCSync et de lire le flag root.

---

## Notes défensives / remédiation

### Correctif
- Restreindre les privilèges d'écriture sur les OUs Active Directory.
- Désactiver le support de RC4 dans la configuration de sécurité Kerberos.

---

## Annexe : Résumé de la timeline
1. Énumération Kerbrute et password spraying.
2. Connexion WinRM en tant qu'adam.scott.
3. Exploitation BadSuccessor dMSA et récupération du hash de l'Administrateur.

---