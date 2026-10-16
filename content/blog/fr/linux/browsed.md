---
id: "HTB-2026-BROWSED"
title: "Browsed"
excerpt: "Browsed utilise une extension exécutée par un navigateur côté serveur pour atteindre une application interne, puis franchit deux frontières d’interprétation : l’arithmétique Bash et le cache d’import Python privilégié."
date: "2026-01-10"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "SSRF", "COMMAND-INJECTION", "CACHE-POISONING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Trois contextes d’exécution

La chaîne est **téléversement d’extension → requêtes de Chrome côté serveur → code source Gitea et Flask internes → injection dans l’arithmétique Bash → shell `larry` → cache Python modifiable → outil lancé par sudo → root**. L’extension tourne dans un worker du navigateur, le script Bash dans le contexte de l’application et le programme Python final sous sudo. Une réponse réseau interne n’est pas encore une exécution de code ; un cache inscriptible n’est pas forcément accepté par Python.

`browsed.htb` désigne la cible autorisée. `<ATTACKER_URL>` représente un récepteur contrôlé dans le laboratoire. Les exemples sont des diagnostics courts ; l’archive d’extension, la connexion de rappel et le bytecode originaux ne sont pas reproduits.

## Exploiter la position réseau du navigateur

La découverte TCP externe montre SSH et HTTP. Le site public autorise le téléversement d’extensions pour validation par un Chrome côté serveur. Les sorties et erreurs de ce test indiquent la présence de `browsedinternals.htb`, un hôte interne offrant Gitea et une application Flask. C’est depuis l’environnement du **worker** qu’il faut résoudre ce nom. Son absence depuis le poste de travail est normale.

Une extension Chrome Manifest V3 peut exécuter un service worker de fond. Ses `host_permissions` définissent les destinations qu’il peut demander. Un content script et un worker de fond n’obéissent pas aux mêmes règles réseau : identifier le contexte qui exécute réellement le code. Une sonde minimale demanderait une page interne inoffensive puis enverrait seulement son statut ou un court marqueur à `<ATTACKER_URL>`. Vérifier à la fois que l’extension a tourné et qu’elle peut lire la réponse. Une connexion sortante vers le récepteur ne prouve pas la lecture du service interne. La [documentation Chrome sur les requêtes des extensions](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests) détaille permissions et contextes.

Une fois Gitea atteignable, examiner le code publié. La route Flask `/routines/<rid>` transmet `rid` en argument à `routines.sh`. Le script choisit une maintenance à l’aide de comparaisons numériques telles que :

```bash
if [[ "$1" -eq 0 ]]; then
    # opération autorisée
fi
```

La frontière en cause se situe dans l’interprétation arithmétique Bash d’un texte contrôlé par l’utilisateur, pas dans une conversion stricte réalisée par Flask. Le droit de lire le dépôt et la possibilité d’atteindre la route sont deux points distincts. Confirmer que l’extension rejoint le service Flask sur son adresse interne ou loopback avant d’affirmer qu’elle peut appeler la route.

## Comprendre la comparaison Bash

Bash évalue arithmétiquement les opérandes de `-eq`. Selon la valeur et la version du shell, cette évaluation peut résoudre des variables et indices de tableaux, avec d’autres évaluations à leur tour. Le [manuel Bash](https://www.gnu.org/software/bash/manual/html_node/Shell-Arithmetic.html) décrit ce langage d’expression. L’erreur consiste à recevoir `rid` comme du texte et à le laisser devenir une expression au lieu de le valider comme entier décimal. Les guillemets autour de `"$1"` limitent certains découpages de mots, mais ne transforment pas l’arithmétique en analyseur strict.

Un test contrôlé commence par `0` et observe la routine normale. Une expression non numérique doit ensuite produire uniquement un marqueur bénin observable. Comparer les résultats et noter la requête, l’invocation du script et l’identité du processus résultant. La chaîne documentée obtient un shell comme `larry` ; l’extrait précédent montre l’entrée vers le puits, pas une transcription d’exploitation complète. Si une valeur ne cause qu’une erreur, vérifier l’encodage du segment URL, l’analyse du shell, les tableaux et l’arrivée de la requête dans le script. Une réponse HTTP favorable ne révèle pas l’identité OS.

La correction consiste à n’accepter qu’un petit ensemble de valeurs, par exemple `0`, `1`, `2` ou `3`, avant l’appel à Bash, puis à choisir une commande fixe. Supprimer un seul caractère spécial laisserait intacte la frontière d’interprétation.

## Examiner l’outil Python sous sudo

Après l’accès `larry`, exécuter `id` et `sudo -l`. La règle pertinente autorise **`/opt/extensiontool/extension_tool.py`** comme root. Le chemin exact compte pour sudo. Examiner imports, version de l’interpréteur, répertoire de travail, propriétaire des sources et permissions de tous les dossiers parents. Le programme importe `extension_utils.py` depuis son répertoire. Le source appartient à root, mais `/opt/extensiontool/__pycache__/` est inscriptible par les utilisateurs ordinaires. Le contrôle se déplace du source vers un cache de bytecode exécutable.

Python conserve souvent les modules importés comme fichiers `.pyc` dans `__pycache__`. Il ne réutilise un cache que si nom, version de l’interpréteur, mode d’invalidation, horodatage et taille ou hash, et relation au source satisfont ses contrôles. Un dossier inscriptible ne suffit donc pas à lui seul. La [référence Python sur les caches](https://docs.python.org/3/reference/import.html#cached-bytecode-invalidation) décrit ces règles. Dans le laboratoire, le fichier concerne `extension_utils` sous CPython 3.12. Une exécution privilégiée peut produire le cache, puis un utilisateur contrôlant le dossier peut tenter de le remplacer tout en conservant un en-tête accepté par l’interpréteur.

Ne pas utiliser un `.pyc` construit avec une autre version de Python. Pour un rejeu autorisé, noter `python3 --version`, la commande sudo exacte, le chemin de recherche des modules, taille et date du source ainsi que l’en-tête du cache. Employer une sonde inoffensive qui écrit un marqueur indiquant l’UID effectif à l’import. Seul un marqueur root après l’appel sudo démontre l’acceptation du cache modifié. Si Python régénère le cache depuis le source, analyser l’invalidation et la recherche des modules au lieu de considérer que le répertoire est protégé.

## Correction et tests de régression

Isoler les extensions dans des workers dont la sortie réseau ne rejoint ni dépôts internes, ni applications loopback, ni services de métadonnées. N’accorder que les permissions d’hôte nécessaires et vérifier que les validations d’extensions approuvées fonctionnent toujours. Restreindre Gitea et Flask aux principaux attendus, même si le navigateur est compromis.

Analyser l’identifiant de routine comme une valeur d’énumération dans l’application et sélectionner des commandes fixes. Supprimer la délégation sudo superflue ; si l’outil Python doit rester privilégié, protéger source, cache, chemins d’import et dossiers parents contre l’écriture du demandeur. Le test doit accepter les identifiants ordinaires, refuser les expressions, bloquer les requêtes internes du navigateur et empêcher un utilisateur faible d’influencer le code importé sous sudo. Surveiller les requêtes des workers vers l’interne, les écritures inattendues dans les caches et leur suivi par un appel sudo.
