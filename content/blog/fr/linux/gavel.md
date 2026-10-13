---
id: "HTB-2026-GAVEL"
title: "Gavel"
excerpt: "Code exposé, injection SQL, règles PHP dynamiques et moteur privilégié : suivre les contrôles distincts qui échouent sur Gavel."
date: "2025-11-29"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SQLI", "RUNKIT", "SUID-EXECUTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et preuves

Le récit de Gavel décrit la récupération du source via `.git`, une injection SQL dans `inventory.php`, le mot de passe retrouvé d’`auctioneer`, une exécution web via les règles d’enchère et root via `/usr/local/bin/gavel-util`.

Il manque requête complète, SQL, analyse de l’exécutable et transcript du moteur. Les extraits expliquent les mécanismes sans reproduire indépendamment toute la chaîne. Distinguer fuite de source, extraction SQL et réutilisation d’identifiants.

## Le source oriente les tests SQL

La cible `gavel.htb` expose SSH et une application PHP. Un répertoire Git lisible révèle parfois routes et construction des requêtes. Il ne retourne pas directement les lignes SQL : une requête vulnérable joignable et des permissions suffisantes restent nécessaires.

Le récit rapporte la récupération d’un mot de passe bcrypt pour `auctioneer`. Il s’agit d’essais hors ligne, pas d’une inversion de bcrypt. Un résultat non autorisé minimal distingue l’injection d’un secret simplement commité dans le dépôt.

Cet exemple PDO corrige une recherche d’inventaire par valeur :

```php
$stmt = $pdo->prepare('SELECT name FROM inventory WHERE id = :id');
$stmt->execute(['id' => $validatedId]);
```

`$pdo` est une connexion existante et `$validatedId` un identifiant validé. [PDO::prepare](https://www.php.net/manual/en/pdo.prepare.php) sépare valeurs et syntaxe ; noms de tables et expressions de tri nécessitent des listes autorisées distinctes.

## Les règles d’enchère sont du code

Le récit décrit une règle modifiée par un administrateur et déclenchée via `runkit_function_add`. La [documentation runkit7](https://www.php.net/manual/en/function.runkit7-function-add.php) décrit la création de fonctions depuis du code. Confirmer l’extension et sa version, sans substituer silencieusement cette API dans le source.

Un administrateur autorisé à ajuster les enchères n’est pas nécessairement autorisé à écrire du PHP exécutable. L’exploitation nécessite évaluation, droits d’écriture et accès au fichier produit. Le récit rapporte `www-data` puis une réutilisation comme `auctioneer` ; enregistrer une règle ne démontre pas ces transitions.

## Le moteur privilégié amplifie le défaut

Le récit présente `gavel-util` comme un moteur YAML SUID et rapporte la modification de `/opt/gavel/.config/php/php.ini` avant une règle ultérieure. L’ordre compte : un fichier modifié n’influence qu’un processus qui le charge au moment approprié.

Le bit SUID ne prouve pas que PHP conserve root. Vérifier propriétaire, UID effectif, gestion des privilèges, configuration chargée et permissions. Root est rapporté sans ces traces. Les payloads créant un shell sont retirés plutôt que présentés comme une recette complète.

## Remédiation et retest

Exclure `.git` du déploiement et de l’exposition web, puis renouveler les secrets. Paramétrer les valeurs SQL et limiter les droits de base. Remplacer les règles exécutables par des données contraintes et des opérateurs explicites.

Retirer l’exécution SUID ou séparer opérations privilégiées et évaluation non fiable. Protéger la configuration et tous ses parents ; les restrictions PHP ne remplacent pas une frontière d’exécution.

Vérifier l’inaccessibilité du dépôt, le traitement des entrées d’injection comme données, le fonctionnement des enchères et l’impossibilité d’écrire du code ou la configuration. Surveiller accès Git, écritures PHP inattendues, exécutions du moteur et changements de configuration suivis d’un interpréteur. La corrélation distingue fuite et élévation.
