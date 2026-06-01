---
id: "HTB-2026-CONVERSOR"
title: "Conversor"
excerpt: "Sur **Conversor**, une vulnérabilité de path traversal dans l'upload permet d'écrire un script dans un dossier exécuté par un cron root, donnant un accès `www-d"
date: "2025-10-25"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "PATH-TRAVERSAL", "CRON-HIJACK", "NEEDRESTART"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Conversor (Linux) Write-Up : Path Traversal → Hijack de Cron → Exploitation de Sudo Needrestart

## TL;DR
Sur **Conversor**, une vulnérabilité de path traversal dans l'upload permet d'écrire un script dans un dossier exécuté par un cron root, donnant un accès `www-data`. La réutilisation de mots de passe de la base locale permet l'accès SSH pour `fismathack`. Enfin, l'élévation s'effectue via une mauvaise configuration de `needrestart` dans sudo en exécutant un script de configuration Perl malveillant.

---

## Cible
- Host : `conversor.htb`
- IP : `10.129.7.27`

---

## Recon : Analyse de la structure web

### Scan Nmap
- **Port 22/tcp** : SSH
- **Port 80/tcp** : HTTP

Le scan de répertoires révèle l'archive `source_code.tar.gz`.

---

## Accès Initial : Path Traversal et Cron

L'analyse de `app.py` révèle un path traversal lors de la sauvegarde du fichier dans `/convert`. Un cron root exécute tous les scripts Python de `/var/www/conversor.htb/scripts/` chaque minute.

En envoyant un fichier nommé `../scripts/pwn.py`, le cron l'exécute et nous renvoie un shell `www-data`.

---

## Accès Utilisateur : Extraction de base de données

Nous dumpons la base SQLite `users.db` et trouvons le hash de `fismathack` :
- Hash : `5b5c3ac3a1c897c94caad48e6c71fdec`
- Mot de passe : `Keepmesafeandwarm`

Nous nous connectons via SSH.

---

## Élévation de privilèges : Sudo Needrestart

L'exécution de `sudo -l` montre que nous pouvons exécuter `needrestart` en tant que root. Le paramètre `-c` charge un fichier de configuration évalué en Perl.

Nous créons `pwn.conf` avec :
```perl
system("cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash");
```

Et lançons l'exploit :
```bash
sudo needrestart -c /home/fismathack/pwn.conf
```

---

## Notes défensives / remédiation

### Correctif
- Valider et assainir les noms de fichiers d'upload.
- Restreindre l'écriture dans les dossiers de scripts cron.
- Ne pas autoriser le passage de fichiers de configuration arbitraires via sudo.

---

## Annexe : Résumé de la timeline
1. Téléchargement des sources de l'application.
2. Path traversal pour écrire dans le dossier cron et obtenir un shell.
3. SSH en tant que `fismathack` avec les identifiants décryptés.
4. Sudo needrestart pour exécuter du code Perl et obtenir root.

---