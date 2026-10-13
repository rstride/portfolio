---
id: "HTB-2026-INTERPRETER"
title: "Interpreter"
excerpt: "Désérialisation Mirth Connect, réutilisation de mot de passe et seconde évaluation de f-strings Python : expliquer les transitions et retirer eval."
date: "2026-02-21"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "DESERIALIZATION", "CVE-2023-43208", "F-STRING-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et prérequis

Le récit d’Interpreter rapporte Mirth Connect 4.4.0, une exécution `mirth`, la base de données, le mot de passe retrouvé de `sedric`, SSH puis un service de notification root évaluant l’entrée.

Le XML initial et l’enregistrement du hash sont absents. Endpoint, gadget, sel, encodage et itérations ne sont pas établis indépendamment. Ne pas copier les paramètres PBKDF2 rapportés dans une commande sans examiner la valeur réelle.

## Mirth Connect : version et contexte

La cible est `interpreter.htb` ; le récit identifie la version dans un JNLP d’administration. Une version exposée oriente les recherches. Vérifier application installée, correctifs et route de désérialisation.

CVE-2023-43208 concerne une exécution non authentifiée avant Mirth Connect 4.4.1 après une correction antérieure incomplète. Les [notes de l’éditeur](https://github.com/nextgenhealthcare/connect/wiki/4.4.1---What's-New) donnent la référence de patch ; la [description du découvreur](https://docs.horizon3ai.com/knowledge_base/weaknesses/H3-2023-0027/) situe l’exécution sous le compte de service.

Le shell `mirth` rapporté n’est pas automatiquement root. Lire /usr/local/mirthconnect/conf/mirth.properties franchit une frontière de permissions distincte. Les identifiants SQL peuvent donner accès aux hashes sans établir le SSH d’un autre utilisateur.

## Récupération et réutilisation

Le récit rapporte la lecture de `PERSON`, le mot de passe retrouvé de `sedric` et sa réutilisation SSH. Un bon hachage augmente le coût des essais sans renforcer un mot de passe faible. Relever format sérialisé et paramètres avant le mode d’outil ; démontrer séparément l’acceptation sur le second service.

Les secrets sont retirés car leurs valeurs n’expliquent pas la transition de privilèges.

## La seconde f-string transforme les données en syntaxe

L’extrait conservé de `/usr/local/bin/notif.py`, décrit comme root derrière un service local, est :

```python
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old"
return eval(f"f'''{template}'''")
```

Le premier formatage insère des chaînes non fiables ; `eval` les analyse ensuite comme une nouvelle f-string. Les accolades deviennent des expressions. Bloquer espaces ou points-virgules ne supprime pas ce défaut. Python avertit du risque d’entrées utilisateur avec [eval](https://docs.python.org/3/library/functions.html#eval).

Le payload encodé et le filtre complet ne sont pas conservés comme contournement vérifié. Root est rapporté ; un rejeu nécessite aussi schéma, connectivité, filtre et identité réelle. Loopback ne rend pas fiable l’entrée d’un utilisateur local.

## Retirer l’évaluation et vérifier

Cet exemple valide l’année séparément, calcule l’âge comme donnée et formate une seule fois :

```python
age = datetime.now().year - year_of_birth
message = f"Patient {first} {last} ({gender}), {age} years old"
```

`datetime` est importé et `year_of_birth` a passé les contrôles de type et plage. L’exemple supprime l’évaluation sans implémenter toute la validation ou l’autorisation.

Mettre Mirth à une version maintenue corrigée, limiter accès SQL et configuration, renouveler les secrets et retirer root au service de notification.

En test, soumettre `{1+1}` dans un nom : la valeur doit rester une donnée ou être rejetée, jamais devenir `2`. Vérifier notifications normales, refus des appelants non autorisés et identité non privilégiée. Surveiller processus enfants inhabituels et créations SUID temporaires en les corrélant aux requêtes plutôt qu’à un motif isolé.
