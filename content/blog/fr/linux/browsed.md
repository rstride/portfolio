---
id: "HTB-2026-BROWSED"
title: "Browsed"
excerpt: "Sur Browsed, une extension Chrome malveillante crée un SSRF vers Gitea, puis une injection Bash et un empoisonnement de cache Python conduisent à root."
date: "2026-01-10"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SSRF", "COMMAND-INJECTION", "CACHE-POISONING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## TL;DR
Sur **Browsed**, l'accès initial est obtenu en exploitant un mécanisme d'upload d'extension Chrome headless pour obtenir un SSRF. Cela permet d'accéder à une instance Gitea interne hébergeant une application Flask. L'analyse du code source révèle une injection arithmétique Bash menant à une RCE en tant que `larry`. L'élévation de privilèges s'effectue en empoisonnant le cache Python dans un dossier `__pycache__` accessible en écriture utilisé par un script exécutable via sudo.

---

## Cible
- Host : `browsed.htb`
- IP : `10.10.11.186`

---

## Recon : Scan de ports et vhosts

### Scan Nmap TCP
Le scan initial révèle trois ports ouverts :
- **Port 22/tcp** : SSH
- **Port 80/tcp** : HTTP
- **Port 8080/tcp** : HTTP Proxy

**Analyse :** Le port 80 propose un validateur d'extensions Chrome via un navigateur headless.

---

## Accès Initial : SSRF via extension Chrome

En téléchargeant une extension Chrome personnalisée contenant du JavaScript malveillant, on peut exécuter du code dans le navigateur headless du serveur. Cela permet de scanner le réseau interne (SSRF) et de découvrir un dépôt Gitea sur `http://browsedinternals.htb`.

---

## RCE : Injection arithmétique Bash

Le dépôt Gitea expose une application Flask. L'analyse de son code source révèle une injection arithmétique dans un script Bash :

```bash
val=$(( $1 + 10 ))
```

En envoyant une requête exploitant le SSRF vers cette application avec une valeur injectée, on obtient l'exécution de commandes et un reverse shell en tant que `larry`.

---

## Élévation de privilèges : Poisoning pycache Python

En listant les privilèges sudo de `larry` :

```bash
larry@browsed:~$ sudo -l
(root) NOPASSWD: /usr/bin/python3 /opt/tools/extension_tool.py
```

Le dossier `__pycache__` associé aux imports de ce script est modifiable par tous. Nous remplaçons le fichier `.pyc` compilé par notre propre payload compilé exécutant une commande système pour obtenir root.

---

## Notes défensives / remédiation

### Correctif
- Isoler les processus de navigateur headless et bloquer l'accès aux adresses IP locales.
- Assainir les entrées passées aux expressions arithmétiques de Bash.
- Rendre les répertoires de cache Python non-modifiables par les utilisateurs non-root.

### Idées de monitoring / détection
- Surveiller l'activité réseau sortante du processus Chrome headless.
- Détecter les écritures suspectes dans les dossiers `__pycache__`.

---

## Leçons retenues
- Les navigateurs headless doivent être strictement isolés du réseau local.
- Les fichiers compilés Python (`.pyc`) peuvent servir de vecteurs d'élévation si les permissions sont trop permissives.

---

## Annexe : Résumé de la timeline
1. Scan Nmap -> Identification de l'upload d'extension.
2. SSRF -> Accès à Gitea et à l'application Flask interne.
3. RCE -> Exploitation de l'injection arithmétique Bash en tant que `larry`.
4. Élévation -> Poisoning du cache Python pour obtenir root.

---
