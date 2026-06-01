---
id: "HTB-2026-TWOMILLION"
title: "TwoMillion"
excerpt: "Sur **TwoMillion**, l'accès initial passe par la génération d'un code d'invitation via l'API, puis la promotion frauduleuse du compte utilisateur en administrat"
date: "2025-09-20"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "API-BYPASS", "COMMAND-INJECTION", "CVE-2023-0386"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — TwoMillion (Linux) Write-Up : Contournement API Invite → RCE par promotion admin → OverlayFS CVE-2023-0386

## TL;DR
Sur **TwoMillion**, l'accès initial passe par la génération d'un code d'invitation via l'API, puis la promotion frauduleuse du compte utilisateur en administrateur. En tant qu'admin, nous injectons des commandes dans la génération de fichiers VPN pour obtenir un shell `www-data`. Nous récupérons les accès SSH d'administration, puis exploitons la vulnérabilité noyau OverlayFS (CVE-2023-0386) pour obtenir root.

---

## Cible
- Host : `2million.htb`
- IP : `10.129.229.66`

---

## Recon : Génération du code d'invitation
Le port 80 est ouvert. L'analyse de `/js/inviteapi.min.js` montre l'appel à `POST /api/v1/invite/generate`.

Nous décodons la réponse base64 pour obtenir le code d'invitation, puis nous enregistrons.

---

## Accès Initial : RCE via promotion admin
Nous exploitons le manque d'autorisation sur l'endpoint `PUT /api/v1/admin/settings/update` pour nous attribuer les droits admin :

```json
{"email":"test@2million.htb","is_admin":1}
```

Une fois administrateur, nous injectons des commandes système dans le paramètre `username` du générateur de profil VPN :
```json
{"username":"x;cat .env;"}
```
Nous obtenons un shell `www-data`. Les identifiants de base de données récupérés (`admin : SuperDuperPass123`) nous permettent de nous connecter via SSH.

---

## Élévation de privilèges : OverlayFS (CVE-2023-0386)
Le noyau Linux est vulnérable à CVE-2023-0386 (OverlayFS/FUSE).

Nous compilons et exécutons l'exploit xkaneiki sur la cible pour copier un binaire SUID dans OverlayFS et obtenir root.

---

## Notes défensives / remédiation

### Correctif
- Imposer des vérifications d'autorisation strictes côté serveur.
- Assainir les entrées utilisateur pour empêcher les injections de commandes.
- Mettre à jour le noyau Linux.

---

## Annexe : Résumé de la timeline
1. Contournement de l'API pour s'enregistrer.
2. Promotion admin et injection dans le VPN pour le shell.
3. Connexion SSH en tant qu'admin.
4. Exploitation de CVE-2023-0386 OverlayFS pour root.

---