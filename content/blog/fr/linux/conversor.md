---
id: "HTB-2026-CONVERSOR"
title: "Conversor"
excerpt: "Traversée de chemins, exécution planifiée, réutilisation de mot de passe et needrestart : suivre les identités à chaque frontière de confiance."
date: "2025-10-25"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "PATH-TRAVERSAL", "CRON-HIJACK", "NEEDRESTART"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne d’attaque et preuves disponibles

Conversor relie une destination d’upload mal contrôlée à l’exécution planifiée de Python, puis à la réutilisation d’identifiants et à une règle sudo permissive. Le récit de lab existant rapporte des accès comme `www-data`, puis `fismathack`, puis root. Il ne contient ni requête d’upload complète ni configuration du planificateur ; les exemples expliquent le mécanisme sans constituer une capture de session.

Un fichier cron appartenant à root ne prouve pas que sa commande s’exécute comme root. Il faut regarder le champ utilisateur, une éventuelle réduction de privilèges et l’identité du processus obtenu. Le shell `www-data` rapporté établit un accès sous ce compte, pas un accès root immédiat.

## Énumération : relier le code au système de fichiers

La cible décrite est `conversor.htb`, avec HTTP et SSH. L’archive exposée `source_code.tar.gz` permet de lire `app.py`. Le code relie une entrée à une opération d’écriture :

```python
file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
```

Joindre des chemins ne les confine pas. Si `filename` est contrôlé par le client, `../scripts/pwn.py` peut atteindre un répertoire voisin ; un chemin absolu peut remplacer le chemin de base. Pour établir l’exploitation, relever le répertoire d’upload, la destination normalisée, les droits d’écriture et le processus consommateur. Cet extrait ne démontre pas toutes ces conditions.

## Exécution planifiée et changement d’utilisateur

Le récit identifie `/var/www/conversor.htb/scripts/` comme un répertoire traité périodiquement. Un fichier Python uploadé ne devient une exécution de code que si l’application peut l’y écrire et si le planificateur l’exécute. Lors d’une reproduction autorisée, un marqueur inoffensif contenant l’identité du processus apporte une preuve plus utile que la seule présence du fichier.

Après l’accès applicatif, le récit décrit la lecture de `users.db`, la récupération du mot de passe de `fismathack` depuis un hash MD5 et sa réutilisation en SSH. Trois contrôles distincts interviennent : accès à la base, résistance du mot de passe aux essais et réutilisation entre services. Retrouver un mot de passe ne prouve pas automatiquement son acceptation en SSH.

## Élévation : une configuration exécutable

La règle sudo rapportée autorise `/usr/sbin/needrestart` sans mot de passe. Son option `-c` sélectionne une configuration utilisant la syntaxe Perl. Le problème démontré concerne la délégation d’une configuration contrôlée par l’utilisateur, pas l’exploitation d’une CVE liée à une version. Voir le [manuel needrestart](https://manpages.debian.org/bookworm/needrestart/needrestart.1.en.html).

Pour une validation contrôlée, `/home/fismathack/probe.conf` est un fichier d’exemple contenant uniquement :

```perl
system('/usr/bin/id');
```

Avec la règle décrite, l’invocation illustrative est :

```bash
sudo /usr/sbin/needrestart -c /home/fismathack/probe.conf
```

L’identité affichée par la configuration établit son contexte d’exécution. Le seul succès de l’utilitaire ne le prouve pas.

## Corriger les frontières et vérifier

- Générer les noms côté serveur et stocker les uploads hors des répertoires exécutables. Si les noms sont conservés, assainir leur composant final et contrôler le confinement, y compris les liens symboliques. Werkzeug précise les [limites de secure_filename](https://werkzeug.palletsprojects.com/en/stable/utils/#werkzeug.utils.secure_filename).
- Réserver l’écriture du code planifié et de ses répertoires parents aux administrateurs de déploiement. Vérifier le compte d’exécution et tester une traversée avec un fichier inoffensif dans un environnement de test.
- Remplacer la délégation sudo ouverte par une opération revue avec une configuration fixe et fiable. Vérifier que l’utilisateur ne peut choisir une autre configuration ni modifier ses dépendances.
- Renouveler les identifiants réutilisés et employer un mécanisme adapté de hachage des mots de passe.

Surveiller les écritures inattendues dans le répertoire planifié et les invocations sudo choisissant une configuration inhabituelle. L’enchaînement écriture puis exécution sous une autre identité est plus significatif qu’un nom de fichier.
