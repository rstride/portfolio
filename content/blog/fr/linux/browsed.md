---
id: "HTB-2026-BROWSED"
title: "Browsed"
excerpt: "Requêtes du navigateur backend, calcul Bash et caches d’import Python : expliquer les conditions de la chaîne d’attaque rapportée."
date: "2026-01-10"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SSRF", "COMMAND-INJECTION", "CACHE-POISONING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et prérequis

Le récit de Browsed rapporte un service de vérification d’extensions Chrome, l’accès au code dans Gitea, une exécution `larry` via un helper Bash et une exécution root via un cache Python modifiable. Il fournit des extraits et une règle sudo, sans package d’extension, échange HTTP complet ni artefact bytecode.

La reproduction nécessite les permissions et la connectivité de l’extension, une entrée contrôlée atteignant le helper, puis l’acceptation du cache par un interpréteur privilégié.

## Le navigateur automatisé comme frontière réseau

La cible `browsed.htb` expose HTTP sur 80 et 8080 ainsi que SSH. L’application lance les extensions uploadées dans un navigateur backend. Le récit indique un accès à `browsedinternals.htb`, où Gitea fournit le code de l’application.

Il s’agit d’une capacité de requête backend, pas d’une preuve que toute extension contourne les restrictions du navigateur. Relever les permissions du manifest, l’origine des requêtes, le mécanisme de lecture ou d’exfiltration et le service interne joignable. Lire un dépôt ne prouve pas le droit d’invoquer l’application décrite.

## Le calcul franchit une frontière d’interprétation

L’extrait conservé est :

```bash
val=$(( $1 + 10 ))
```

L’opération accepte une expression, pas nécessairement un entier décimal. Bash peut évaluer récursivement variables et indices de tableaux ; les conséquences en exécution dépendent du chemin d’expansion. Voir la [documentation arithmétique Bash](https://www.gnu.org/software/bash/manual/html_node/Shell-Arithmetic.html). L’extrait ne révèle ni paramètre HTTP complet ni payload universel.

Le lab rapporte une connexion inverse comme `larry`. Pour étayer la chaîne, conserver l’entrée, l’invocation exacte, le chemin réseau depuis le navigateur et l’identité du processus. Un résultat numérique correct fournit un contrôle positif, pas une preuve d’exécution de commandes.

## Le cache Python doit être accepté

Le récit rapporte cette invocation privilégiée :

```bash
sudo /usr/bin/python3 /opt/tools/extension_tool.py
```

Elle nécessite l’autorisation sudo décrite. Un `__pycache__` modifiable est identifié dans le répertoire d’un helper, sans nom du module ni en-tête. CPython vérifie compatibilité et règles d’invalidation par date/taille ou hash. Des octets `.pyc` quelconques dans un répertoire modifiable ne suffisent pas. Voir la [documentation Python de l’invalidation](https://docs.python.org/3/reference/import.html#cached-bytecode-invalidation).

Une reproduction relève version, chemin d’import réel, présence du source, nom et en-tête du cache, permissions des parents et module importé. L’accès root reste rapporté ; aucun payload bytecode n’est reconstruit.

## Remédiation et vérification

Isoler la vérification d’extensions dans un worker avec filtrage des sorties, sans accès aux dépôts internes ni aux secrets hôtes. Tester destinations interdites et requêtes externes approuvées ; le sandbox système du navigateur ne définit pas seul la politique réseau.

Parser l’entrée comme entier et contrôler sa plage avant calcul, en rejetant la syntaxe d’expression. Vérifier les valeurs ordinaires. Une liste noire de quelques caractères shell ne suffit pas.

Supprimer la délégation privilégiée inutile ou réserver aux administrateurs tous les sources, caches, chemins de recherche et répertoires parents. Désactiver l’écriture de bytecode n’empêche pas la lecture d’un cache empoisonné.

Surveiller les requêtes internes du worker et les écritures dans les modules ou caches suivies d’une exécution Python privilégiée. Vérifier l’import de code fiable après redémarrage, pas seulement la suppression d’un fichier. Le défaut commun est la confiance dans une donnée utilisateur à une frontière d’exécution.
