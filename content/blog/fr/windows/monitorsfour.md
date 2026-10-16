---
id: "HTB-2026-MONITORSFOUR"
title: "MonitorsFour"
excerpt: "MonitorsFour commence par une comparaison de jeton défaillante, atteint un conteneur Cacti, puis exploite l’API Docker Desktop exposée pour accéder aux fichiers de l’hôte Windows."
date: "2025-12-06"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "CACTI", "CVE-2025-24367", "DOCKER-ESCAPE"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Distinguer trois frontières

La chaîne est **recherche d’utilisateurs HTTP → hash de mot de passe → connexion Cacti → injection dans un graphe → shell dans un conteneur Linux → API Docker Engine → disque Windows**. Le premier défaut divulgue des données, le deuxième permet une exécution authentifiée dans l’application, le dernier donne le contrôle d’un autre conteneur et de ses montages. La machine est classée Windows, mais Cacti tourne sous Linux. `root` dans un conteneur n’est pas l’Administrateur Windows.

`monitorsfour.htb` et `cacti.monitorsfour.htb` sont les hôtes virtuels du laboratoire. Les commandes sont des diagnostics sur la machine autorisée ; aucun mot de passe, flag ou corps de script d’exploitation n’est publié. Lire un fichier Windows à travers un montage prouve l’accès aux fichiers de l’hôte, pas automatiquement l’exécution de code Windows.

## Trouver la divulgation initiale

La reconnaissance réseau et des hôtes virtuels fait apparaître le site de l’entreprise et l’hôte Cacti. Avant de tenter une vulnérabilité Cacti, examiner les routes du site principal. `/user` signale un paramètre manquant lorsqu’aucun jeton n’est fourni. La requête `/user?token=0` retourne des enregistrements d’utilisateurs avec leurs hashes. La présence de toute la liste est une meilleure preuve qu’un simple code HTTP 200 : il faut vérifier que le demandeur ne devait recevoir ni ces comptes ni ces champs.

La vérification PHP parcourt les jetons stockés et emploie l’égalité faible `==`. Un des jetons a la forme `0e...`, suivie de chiffres. PHP interprète cette chaîne et `"0"` comme le nombre zéro dans cette comparaison. La valeur fournie est ainsi acceptée comme égale à ce jeton précis. Cela ne signifie pas que zéro correspond à tous les jetons. La [documentation PHP sur les comparaisons](https://www.php.net/manual/en/language.operators.comparison.php) décrit les conversions de type. Le contrôleur aggrave l’erreur en retournant toutes les colonnes des utilisateurs, dont les hashes, dès qu’un jeton passe.

Cette commande illustrative ne conserve que les noms au lieu de recopier toutes les données :

```bash
curl -s 'http://monitorsfour.htb/user?token=0' | jq '.[].username'
```

`jq` attend un tableau JSON. Si le serveur renvoie un objet d’erreur, ce filtre ne prouve aucun contournement. Les mots de passe sont représentés par des hashes MD5 dans le laboratoire ; identifier leur format avant toute recherche hors ligne autorisée. Un mot de passe candidat n’a de valeur qu’après une connexion Cacti réussie. Ici, `marcus` peut s’y connecter. La divulgation et la connexion sont deux observations distinctes.

## Franchir la frontière des graphes Cacti

Cacti 1.2.28 est présent sur le second hôte. CVE-2025-24367 concerne des fonctionnalités de graphe accessibles à un utilisateur authentifié possédant les droits adéquats. Un saut de ligne dans certaines options peut modifier les instructions envoyées à RRDtool et permettre l’écriture de PHP dans un chemin servi par le web. L’[avis de Cacti](https://github.com/Cacti/cacti/security/advisories/GHSA-fxrq-fr7h-9rqq) explique le défaut et la version corrigée. Une simple connexion ne suffit pas : il faut pouvoir invoquer l’action vulnérable et écrire au bon endroit.

Pour un rejeu, relever la version installée, la session `marcus`, les droits sur les graphes, la requête modifiant l’entrée RRDtool et le fichier obtenu. Commencer par une petite sonde inoffensive et la lire par HTTP. Une page de graphe réussie établit uniquement le rendu de cette page. Une sonde PHP accessible et indiquant `www-data` démontre l’exécution côté serveur. Si un outil public est utilisé, examiner son code et ses paramètres : appeler un fichier `exploit.py` n’explique rien. Conserver la requête et le chemin créés plutôt que son seul message de réussite.

Dans le shell, `id`, `cat /proc/1/cgroup` et les chemins visibles aident à confirmer le contexte Linux conteneurisé. L’hôte peut exécuter Docker Desktop sur Windows avec WSL2. Cette distinction évite d’appeler le shell Cacti un shell Windows SYSTEM.

## Tester le plan de contrôle Docker

Depuis le conteneur du laboratoire, l’API Docker Engine répond à `192.168.65.7:2375` sur le sous-réseau interne de Docker Desktop. Un éventuel `/var/run/docker.sock` serait une autre interface, par socket Unix. Il faut tester celle réellement constatée. Commencer par une requête en lecture :

```bash
curl -sS http://192.168.65.7:2375/version | jq '{Version,ApiVersion,Os,Arch}'
```

La réponse prouve la connectivité vers une API Engine, sans encore prouver tous les droits sur celle-ci. Vérifier l’autorisation avant d’affirmer pouvoir créer un conteneur. CVE-2025-9074 décrit cet accès à l’API interne depuis des conteneurs dans certaines configurations Docker Desktop. La [documentation de sécurité Docker](https://docs.docker.com/engine/security/) explique pourquoi le contrôle du démon est sensible : il peut créer des conteneurs dotés de montages de l’hôte.

Dans `HostConfig.Binds`, le chemin source est résolu sur **l’hôte du démon**, pas dans le conteneur Cacti qui envoie la requête. Dans ce montage Docker Desktop, `/mnt/host/c` représente le disque C: de Windows. Un nouveau conteneur peut le monter dans son propre système de fichiers et accéder aux données qu’il contient. Vérifier l’image disponible sur le démon et le chemin source avant une requête de création ; une image absente ou un montage différent conduisent à une erreur. Une réponse de création donne un identifiant de conteneur, mais il faut encore démarrer ce dernier et contrôler le montage de l’intérieur.

Une requête de création illustrative rend la frontière de confiance visible. `<EXISTING_IMAGE>` représente une image déjà présente sur le démon et contenant `sh` ; le montage est en lecture seule pour ce diagnostic :

```http
POST /containers/create HTTP/1.1
Host: 192.168.65.7:2375
Content-Type: application/json

{"Image":"<EXISTING_IMAGE>","Cmd":["sh","-c","ls -ld /host-c/Windows"],"HostConfig":{"Binds":["/mnt/host/c:/host-c:ro"]}}
```

La réponse doit fournir un identifiant de conteneur. Démarrer cet identifiant et lire ses journaux sont deux opérations API distinctes ; l’identifiant seul ne prouve pas que le montage existe. `ls` vérifie seulement le répertoire. Un retest utile compare donc un fichier témoin approuvé placé sur le disque hôte avec ce que voit le nouveau conteneur. Cette requête sert à expliquer le mécanisme et n’est pas une capture du laboratoire.

Le résultat pertinent du laboratoire est la lecture des fichiers de l’hôte. Le champ Docker `Privileged` n’est pas requis pour cette lecture et ne doit pas être confondu avec le montage. Une lecture de fichier ne démontre pas l’exécution d’un processus Windows. Toute voie ultérieure par tâche planifiée nécessiterait ses propres observations et ne fait pas partie de cette chaîne minimale.

## Interpréter chaque résultat à sa frontière

| Observation | Conclusion justifiée | Conclusion non démontrée |
| --- | --- | --- |
| `/user?token=0` renvoie utilisateurs et hashes. | Le contrôle du jeton et le filtrage de la réponse sont défaillants. | Les identifiants Cacti sont déjà retrouvés. |
| `marcus` se connecte à Cacti et voit les graphes. | Le secret fonctionne et le rôle donne accès aux graphes utiles. | RRDtool a déjà créé un fichier exécutable. |
| Une sonde PHP bénigne s’exécute par l’URL Cacti. | L’entrée du graphe a franchi la frontière vers l’exécution serveur. | Le shell possède les droits Administrateur Windows. |
| `/version` répond sur TCP 2375 depuis le conteneur. | Le conteneur applicatif rejoint l’API Docker. | Il peut créer un conteneur ou monter le disque hôte. |
| Un nouveau conteneur lit un fichier témoin sous `/mnt/host/c`. | Le démon a accepté un montage du disque Windows et exposé ses fichiers. | Un processus Windows s’est exécuté comme Administrateur. |

Cette distinction aide au diagnostic et à la correction. Les deux premières étapes touchent l’autorisation applicative ; la troisième, la génération de commandes et l’écriture dans le Linux conteneurisé ; la dernière, l’intégration hôte de Docker Desktop. Corriger une frontière ne ferme pas forcément les autres. Employer des fichiers témoins différents pour l’écriture PHP et le montage Windows, puis noter le processus ou conteneur à l’origine de chaque observation. L’existence d’un chemin Windows n’équivaut pas à un contrôle complet de l’hôte : lire, modifier et exécuter sont trois capacités distinctes.

## Diagnostiquer et corriger

Si `token=0` est refusé, examiner la version PHP et la forme du jeton stocké ; ce défaut exige une égalité faible et une collision de chaînes numériques. Si la connexion Cacti réussit mais pas l’injection, contrôler les droits sur les graphes, la version, le traitement du saut de ligne, l’appel RRDtool et les permissions du répertoire web. Si `/version` répond mais pas la création d’un conteneur, regarder les droits de l’API, les images et les réponses des opérations de création et démarrage. Si `/mnt/host/c` est vide, identifier l’hôte et le backend réels du démon.

Comparer les jetons comme des chaînes attendues, avec une comparaison appropriée, et ne jamais inclure les hashes dans une réponse de profil. Renouveler les secrets exposés et remplacer le stockage MD5 sans sel. Mettre Cacti à une version corrigée et empêcher l’exécution PHP dans les chemins inscriptibles. Mettre Docker Desktop à jour, restreindre les accès du conteneur au démon et les partages de disque, puis protéger la gestion par authentification et autorisation. Le retest doit montrer l’absence de liste pour un appel non authentifié, le fonctionnement des graphes légitimes sans création de PHP, le refus de l’API Engine depuis l’application et l’impossibilité de monter le disque Windows depuis un compte peu privilégié.
