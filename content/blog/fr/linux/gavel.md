---
id: "HTB-2026-GAVEL"
title: "Gavel"
excerpt: "Gavel est un site d’enchères dont le code exposé révèle un désaccord subtil entre analyseurs SQL, des règles d’enchères exécutables et un démon privilégié chargé de les traiter."
date: "2025-11-29"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SQLI", "RUNKIT", "PRIVILEGED-DAEMON"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et identités

La progression est **`.git` lisible → code PHP → injection SQL dans l’inventaire → hash `auctioneer` → connexion administrateur → règle PHP comme `www-data` → réutilisation du secret comme `auctioneer` → soumission à `gaveld` → exécution root**. Fuite de base, exécution web, connexion Unix et démon root représentent quatre frontières distinctes. `gavel-util` sert de client au démon privilégié ; le décrire comme un simple programme SUID exécutant du YAML masque le lieu de l’autorité finale.

`gavel.htb` est l’hôte du laboratoire. Les commandes et extraits sont illustratifs. Aucun secret, URL d’injection complète, flag ou payload de shell venu d’un autre récit n’est recopié.

## Suivre les indices du code source

La reconnaissance montre SSH et un site d’enchères HTTP. Tester l’exposition de `.git`, puis récupérer les fichiers nécessaires à l’étude des routes et des requêtes. Un dépôt lisible révèle l’implémentation et parfois la configuration, mais ne retourne pas directement les lignes de la base. Le gestionnaire d’inventaire reçoit `sort` et `user_id`. Il construit une expression de colonne depuis `sort`, retire les accents graves, entoure le résultat de ces caractères, puis place cette expression dans une chaîne passée à `PDO::prepare()`. Une autre valeur est liée pour l’identifiant utilisateur.

Le motif essentiel est :

```php
$col = '`' . str_replace('`', '', $sortItem) . '`';
$stmt = $pdo->prepare("SELECT $col FROM inventory WHERE user_id = ?");
$stmt->execute([$userId]);
```

Cet extrait raccourci est **illustratif** ; il faut regarder la requête complète du laboratoire et ses branches avant de tester. Lier une valeur ordinaire fonctionne normalement. Le problème vient du fait qu’un identifiant SQL, comme un nom de colonne, ne peut pas être donné au moyen d’un placeholder de valeur : `$col` est donc assemblé comme syntaxe SQL. Ici, PDO peut émuler la préparation et interpréter les marqueurs `?` différemment de MySQL lorsqu’une barre oblique inverse interagit avec un identifiant entre accents graves. Une valeur `sort` construite peut décaler la perception par PDO du placeholder, puis la valeur contrôlée de `user_id` arrive à une position syntaxique après substitution. La [recherche initiale sur l’analyseur PDO](https://www.slcyber.io/research/a-novel-technique-for-sql-injection-in-pdos-prepared-statements) décrit cette divergence ; la [documentation PDO::prepare](https://www.php.net/manual/en/pdo.prepare.php) explique l’émulation et les limites des paramètres liés.

Pour un test contrôlé, comparer un tri ordinaire à une entrée qui change le nombre de marqueurs vus ou l’expression de colonne, puis observer la requête finale ou une donnée bénigne de la base. Une erreur 500 seule ne démontre aucune extraction. Relever les deux paramètres, l’état de l’émulation et la branche de code. Désactiver l’émulation peut modifier l’erreur, mais la solution durable choisit les noms de colonnes dans une liste fixe côté serveur et lie seulement les valeurs.

Dans le laboratoire, cette route divulgue un hash bcrypt de `auctioneer`. La recherche hors ligne d’un mot de passe n’inverse pas bcrypt. Vérifier le candidat sur la connexion d’administration avant d’affirmer contrôler les règles d’enchères. Un secret faible reste trouvable même si bcrypt fonctionne correctement.

## De la règle d’enchère au PHP

Un administrateur peut modifier des règles d’enchères. L’application traite ensuite le champ `rule` comme le corps d’une fonction PHP créée avec `runkit_function_add`, puis l’évalue lors d’une mise. La frontière se situe entre configuration métier et code exécutable. Sauvegarder la règle modifie seulement un état ; une mise doit encore la déclencher, puis l’identité du processus doit être vérifiée. La [documentation de runkit](https://www.php.net/manual/en/function.runkit7-function-add.php) décrit la création dynamique d’une fonction, bien que la version de l’extension du laboratoire doive être vérifiée.

Une règle de contrôle peut retourner un booléen prévisible tout en écrivant un marqueur inoffensif. Soumettre ensuite une mise qui l’atteint. Le marqueur et `id` démontrent l’exécution sous le processus web, `www-data`. Si la règle est sauvegardée mais qu’aucun marqueur n’apparaît, contrôler publication, enchère choisie, contraintes de mise et appel réel au moteur de règles. Le rôle administrateur ne signifie pas une exécution OS tant que la règle n’est pas évaluée.

Le mot de passe retrouvé fonctionne également pour l’utilisateur Unix `auctioneer`. Cette réutilisation exige une vérification SSH distincte puis `id`. L’appartenance de l’utilisateur à un groupe donne accès au socket Unix du démon. Le mot de passe seul ne donne pas root ; c’est le traitement accepté par ce socket qui crée le risque.

## Examiner le démon privilégié

`gavel-util submit <file.yaml>` envoie un fichier YAML à `/var/run/gaveld.sock`. Le socket appartient au groupe vendeur, et `gaveld` traite les requêtes avec des droits élevés. Le YAML contient des métadonnées d’objet et un champ `rule` en PHP. Le démon teste la règle dans un interpréteur PHP doté d’une configuration restrictive sous `/opt/gavel/.config/php/php.ini`. Ce fichier impose notamment `disable_functions` et `open_basedir`. Une réponse YAML prouve la soumission, pas que le parseur, le bac à sable puis l’exécution aient produit un effet privilégié.

Le laboratoire comporte deux faiblesses proches. Dans une voie, une fonction d’écriture encore autorisée peut modifier la configuration PHP ; une requête **ultérieure** lance alors l’interpréteur avec des restrictions affaiblies. Dans l’autre, le client fournit une variable d’environnement `RULE_PATH` que le démon accepte comme autre chemin de configuration. Dans les deux cas, le démon privilégié fait confiance à un réglage influencé par un utilisateur moins privilégié. Vérifier le chemin effectivement chargé, la création d’un nouvel interpréteur pour chaque soumission et l’UID de tout effet produit. Un `php.ini` modifié n’agit que sur les processus qui le chargeront après cette modification. `/tmp` peut aussi différer entre Apache et le démon à cause de `PrivateTmp` dans systemd : un fichier invisible du shell web peut se trouver dans un autre espace de montage. Comparer montages et espaces de noms avant de conclure à un échec.

Une sonde contrôlée devrait écrire un marqueur inoffensif dont le propriétaire serait root, puis vérifier ce propriétaire. Une réponse de soumission ou un fichier créé comme `auctioneer` ne prouve pas root. L’identité réelle du démon compte davantage qu’une affirmation générique sur SUID.

## Corriger et retester

Retirer `.git` du répertoire web déployé. Choisir les colonnes de tri dans une liste fixe et tirer l’identité utilisateur de la session plutôt que de `user_id` fourni. Réduire les permissions SQL pour limiter l’impact d’une requête défaillante. Renouveler le secret retrouvé et arrêter sa réutilisation entre site et SSH. Remplacer les règles PHP par un format d’expression limité, sans accès aux fichiers ni aux processus.

Pour le démon, authentifier et autoriser les clients du socket, valider les champs YAML, supprimer l’évaluation de PHP arbitraire et protéger la configuration de l’interpréteur ainsi que ses dossiers parents. L’utilisateur dont le code est censé être restreint ne doit ni modifier ni choisir le bac à sable. Tester à nouveau l’accès au dépôt, le tri normal, les valeurs `sort` et `user_id` non autorisées, les mises légitimes, les soumissions et les changements de configuration. Surveiller les requêtes `.git`, lectures SQL inattendues, éditions de règles suivies d’écritures PHP et lancements du démon avec une configuration modifiée.
