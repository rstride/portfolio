---
id: "HTB-2026-MONITORSFOUR"
title: "MonitorsFour"
excerpt: "Injection d’options de graphes Cacti et accès au démon Docker : distinguer le shell dans le conteneur de l’accès aux fichiers de l’hôte Windows."
date: "2025-12-06"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "CACTI", "CVE-2025-24367", "DOCKER-ESCAPE"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et prérequis

MonitorsFour associe une cible exposée côté Windows à une exécution dans un conteneur Linux. Le récit rapporte un login Cacti `marcus`, une exécution `www-data`, puis l’accès à un démon Docker et à un système de fichiers Windows monté.

L’acquisition initiale du hash n’est pas documentée : « extraire les hashes de la base locale » n’explique pas la lecture par un visiteur distant. Cette version commence avec des identifiants Cacti valides. Le récit n’établit pas non plus si l’accès au démon utilise un socket Unix ou une API TCP ; ce sont deux interfaces distinctes, pas des observations interchangeables.

## Cacti : l’authentification n’est qu’une condition

Le nom web rapporté est `cacti.monitorsfour.htb`. CVE-2025-24367 affecte Cacti jusqu’à 1.2.28 et est corrigée en 1.2.29. Elle nécessite un utilisateur authentifié ayant accès aux fonctions de graphe concernées. Des retours à la ligne dans les options peuvent introduire d’autres opérations RRDtool, écrivant du PHP dans un fichier servi par le web. Voir [l’avis Cacti](https://github.com/Cacti/cacti/security/advisories/GHSA-fxrq-fr7h-9rqq).

Une reproduction solide relève la version installée, les droits sur les graphes, le déclencheur, le fichier créé et l’identité du processus. La commande `exploit.py` initiale n’indique ni provenance ni contrat d’arguments ; elle n’est donc pas conservée comme instruction reproductible. Le shell `www-data` rapporté est un accès au conteneur, pas encore une exécution administrateur Windows.

## Accès Docker : identifier le plan de contrôle réel

Un montage de `/var/run/docker.sock` expose un socket Unix si ses permissions permettent l’accès. `192.168.65.7:2375` désigne une API HTTP dans le récit initial. Trouver le chemin ou le port ne prouve pas le droit de créer des conteneurs.

Pour une vérification autorisée, ces exemples en lecture seule représentent deux alternatives. Utiliser uniquement l’interface réellement observée :

```bash
curl --unix-socket /var/run/docker.sock http://localhost/version
curl http://192.168.65.7:2375/version
```

La première commande vise le socket local ; la seconde, le listener TCP rapporté. Une réponse de version établit la connectivité, pas toutes les permissions administratives. Docker explique le risque lié au contrôle du démon dans sa [documentation de sécurité Engine](https://docs.docker.com/engine/security/).

## Séparer accès aux fichiers et exécution sur l’hôte

Le récit décrit la création d’un conteneur utilisant `/mnt/host/c` comme source de bind mount, puis la lecture de fichiers Windows à travers ce montage. Le chemin source est résolu sur l’hôte du démon, pas dans le système de fichiers du client. Son existence et sa correspondance avec le disque Windows doivent être vérifiées sur ce déploiement.

Le JSON initial n’active pas `Privileged: true` ; un montage de l’hôte et un conteneur privilégié sont deux paramètres différents. Root dans Linux n’est pas non plus Windows SYSTEM. Lire un fichier d’Administrator via un montage exposé démontre l’accès aux données de l’hôte, pas à lui seul une exécution arbitraire Windows.

## Remédiation et vérification

Mettre Cacti à une version maintenue contenant le correctif, limiter l’édition des templates et supprimer les fichiers créés par l’exploitation. Vérifier l’application installée sans se fier uniquement au tag d’image.

Retirer les sockets et accès réseau au démon inutiles depuis les conteneurs applicatifs. Pour les besoins de gestion, imposer authentification et autorisation, puis limiter le partage des disques hôtes. Dans un environnement jetable, vérifier que l’identité applicative ne peut joindre le démon ni créer un bind hôte ; confirmer le fonctionnement des graphes légitimes.

Surveiller les écritures PHP inattendues dans le web root Cacti, les requêtes Docker issues des conteneurs et les créations avec montage de disque hôte. Relever le montage et l’appelant explique mieux l’élévation que de qualifier tout accès conteneur de « Docker escape ».
