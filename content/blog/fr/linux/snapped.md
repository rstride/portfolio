---
id: "HTB-2026-SNAPPED"
title: "Snapped"
excerpt: "Sur **Snapped**, la découverte du sous-domaine `admin.snapped.htb` révèle Nginx UI. Nous téléchargeons une sauvegarde non authentifiée via `/api/backup` décrypt"
date: "2026-03-23"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "BACKUP-DISCLOSURE", "NGINX-UI", "CVE-2026-3888"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Snapped (Linux) Write-Up : Divulgation de backup Nginx UI → Race condition snapd CVE-2026-3888

## TL;DR
Sur **Snapped**, la découverte du sous-domaine `admin.snapped.htb` révèle Nginx UI. Nous téléchargeons une sauvegarde non authentifiée via `/api/backup` décryptée grâce aux en-têtes de sécurité. Le cracking du hash de `jonathan` fournit un accès SSH. L'élévation s'effectue via une vulnérabilité temporelle de snapd (CVE-2026-3888) pour déposer un shell SUID root.

---

## Cible
- Host : `snapped.htb`
- IP : `10.129.11.109`

---

## Recon : Sous-domaines
Le scan de vhosts révèle `admin.snapped.htb`. Ce vhost héberge l'application Nginx UI (2.3.2).

---

## Accès Initial : Fuite de backup Nginx UI
L'endpoint `/api/backup` est accessible sans authentification. Nous l'appelons et récupérons l'en-tête `X-Backup-Security` contenant la clé AES et l'IV.

Après décryptage du fichier ZIP et extraction de `database.db`, nous obtenons le mot de passe de `jonathan` : `linkinpark`. Nous nous connectons en SSH.

---

## Élévation de privilèges : Race condition snapd (CVE-2026-3888)
Le système utilise snapd `2.63.1+24.04` contenant une vulnérabilité d'élévation locale dans `snap-confine`.

Nous téléchargeons l'exploit compilé pour x86_64, exploitons le nettoyage de dossiers temporaires par `systemd-tmpfiles` et générons un bash SUID root sous `/var/snap/firefox/common/bash`.

---

## Notes défensives / remédiation

### Correctif
- Mettre à jour Nginx UI et snapd vers les dernières versions patchées.
- Surveiller la création de binaires SUID dans les dossiers d'applications snap.

---

## Annexe : Résumé de la timeline
1. Scan de sous-domaines et détection de Nginx UI.
2. Téléchargement et décryptage de la sauvegarde pour obtenir les accès SSH.
3. Exploitation de la vulnérabilité snapd CVE-2026-3888 pour root.

---