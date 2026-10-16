---
id: "HTB-2026-TWOMILLION"
title: "TwoMillion"
excerpt: "TwoMillion enseigne l’autorisation des API avant de devenir une chaîne d’injection de commandes et d’élévation locale. Chaque réponse doit être interprétée selon le rôle du demandeur."
date: "2025-09-20"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "API-BYPASS", "COMMAND-INJECTION", "CVE-2023-0386"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Parcours général

La chaîne est **découverte d’invitation → compte ordinaire → modification non autorisée du rôle admin → injection dans la génération VPN comme `www-data` → secret applicatif réutilisé en SSH par `admin` → élévation locale OverlayFS**. L’encodage de l’invitation relève de l’énigme et non d’une barrière de sécurité. L’inscription crée une session ordinaire ; la requête de paramètres suivante présente le défaut d’autorisation. Le rôle administrateur de l’application, le compte Unix `admin` et root sont trois identités différentes.

La cible est `2million.htb`. `<LAB_SESSION_COOKIE>` représente une session ordinaire du laboratoire et `<ATTACKER_IP>` une adresse contrôlée. Aucun cookie réel, mot de passe, binaire d’exploitation ou flag n’apparaît. Les exemples HTTP montrent le format des demandes, pas une capture de session.

## Lire le client, vérifier le serveur

La reconnaissance TCP indique SSH et le site web. Son JavaScript pointe vers `/api/v1/invite/how/to/generate` et `/api/v1/invite/generate`. Les instructions utilisent ROT13 et le code d’invitation retourné est encodé en Base64. Décoder ces valeurs révèle le parcours d’invitation, mais ne prouve pas à lui seul une vulnérabilité : la vraie question est de savoir qui est censé pouvoir générer une invitation côté serveur. Obtenir un code valide et créer un utilisateur normal. Vérifier la session sur une page réservée aux utilisateurs avant de tester les fonctions administrateur.

L’inventaire des routes API est alors utile. Le endpoint de paramètres accepte un champ `is_admin` transmis par le client. Cette requête normalisée montre le risque :

```http
PUT /api/v1/admin/settings/update HTTP/1.1
Host: 2million.htb
Cookie: <LAB_SESSION_COOKIE>
Content-Type: application/json

{"email":"test@2million.htb","is_admin":1}
```

Un utilisateur ordinaire ne devrait ni appeler cette fonction administrateur ni modifier un attribut privilégié. Le défaut est un contrôle d’autorisation serveur absent ou inefficace, potentiellement associé à une affectation massive de `is_admin`. OWASP distingue l’[autorisation des fonctions](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/) de celle des [propriétés](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/). Un HTTP 200 constitue une preuve faible : relire le rôle effectif et appeler une opération administrateur inoffensive. Tester aussi un autre email pour savoir si la cible est choisie par le client. Il faut établir quel compte a changé de rôle et pourquoi l’appelant y était autorisé.

Si la requête échoue, contrôler que le cookie appartient à un compte ordinaire connecté, la méthode, le type de contenu, la protection CSRF et les types des champs. Une invitation manquante ne renseigne pas sur l’autorisation administrateur : ce sont deux étapes séparées.

## De la génération VPN au shell

Avec le rôle **applicatif** nouvellement obtenu, l’utilisateur peut appeler `POST /api/v1/admin/vpn/generate`. La route reçoit un nom d’utilisateur inséré dans une commande serveur de création du profil VPN. La frontière dangereuse apparaît si l’application construit une chaîne pour le shell et laisse le texte du demandeur devenir de la syntaxe. Examiner le code de la route ou une trace pour connaître l’appel et ses guillemets. Une sonde bénigne peut produire un profil avec un nom normal, puis utiliser des métacaractères dont le seul effet serait un marqueur. Comparer les réponses et identifier le processus. La chaîne du laboratoire donne une exécution comme `www-data`. Une erreur ou la seule création d’un profil ne prouvent pas une injection.

Ce défaut diffère de la modification du rôle. Même un administrateur correctement autorisé pourrait exploiter une commande assemblée sans précaution ; même une commande sécurisée laisserait possible un changement de rôle non autorisé. Les deux frontières demandent une correction. La session admin appartient au site ; le shell appartient au compte OS du service web.

Depuis ce shell, le fichier `.env` contient des identifiants. Vérifier ses permissions et la raison de sa lisibilité par le service web. Dans le laboratoire, un mot de passe est réutilisé pour le compte Unix `admin`. Tester le candidat en SSH et lancer `id` après connexion ; lire `.env` ne transforme pas la session en ce compte. Ne pas recopier tout le fichier d’environnement dans les notes : il peut contenir des secrets sans rapport.

## Évaluer OverlayFS avec précision

La voie root utilise CVE-2023-0386, un défaut de copie OverlayFS lié à la propriété ou aux capabilities lorsque les fichiers passent entre montages et espaces de noms utilisateur. Le laboratoire rapporte Ubuntu 22.04 et le noyau `5.15.70-051570-generic`. Ce nom suggère un vieux noyau mainline sans déterminer à lui seul sa vulnérabilité : une distribution peut rétroporter un correctif et un build personnalisé peut différer de sa bannière. L’[avis de sécurité Ubuntu](https://ubuntu.com/security/CVE-2023-0386) indique le statut des paquets selon la version.

Inventaire autorisé depuis `admin` :

```bash
uname -r
findmnt -t overlay,fuse,fuseblk
sysctl kernel.unprivileged_userns_clone
```

Ces commandes donnent le noyau actif, les montages visibles et un paramètre courant des espaces utilisateur ; elles ne couvrent pas tous les prérequis. L’outil public dépend aussi du comportement FUSE, de répertoires inscriptibles, de l’architecture et d’une compilation adaptée. Examiner son code et ses instructions plutôt qu’exécuter un binaire anonyme portant le nom d’un tutoriel. Une sortie « success » ne suffit pas : vérifier l’UID effectif, les capabilities et le droit réellement franchi. En cas d’échec, contrôler le noyau actif après redémarrage, les systèmes de fichiers, la politique des espaces de noms et la provenance de l’outil.

## Corriger et tester

Définir explicitement la politique d’invitation côté serveur ; encoder un message ne restreint rien. Autoriser chaque route d’administration, déduire l’identité du compte depuis la session et choisir les champs modifiables dans une liste fixe afin qu’un utilisateur normal ne puisse régler `is_admin`. Lancer l’outil VPN avec des arguments séparés, sans chaîne shell, valider le nom et donner un minimum de droits au processus web. Sortir les secrets des fichiers applicatifs lisibles quand c’est possible et renouveler ceux qui ont été exposés ou réutilisés pour SSH.

Installer le noyau corrigé de la distribution, redémarrer et vérifier le noyau **actif** ainsi que l’état du paquet éditeur. Refaire les tests d’inscription, génération VPN normale, modification de rôle non autorisée, noms contenant des métacaractères, ancien mot de passe SSH et comportement des espaces de noms. Corréler changements de rôle, échecs VPN et processus enfants inattendus du serveur web ; surveiller aussi les fichiers privilégiés créés sur les montages overlay. L’accès root n’existe que si chacune des transitions nécessaires a réellement réussi.
