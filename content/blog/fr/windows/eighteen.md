---
id: "HTB-2026-EIGHTEEN"
title: "Eighteen"
excerpt: "Eighteen utilise un droit d’usurpation dans SQL pour atteindre un hash web, puis un compte de service géré délégué pour franchir une frontière de privilèges Active Directory."
date: "2025-11-15"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "DMSA", "BADSUCCESSOR", "KERBEROS-PAC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Suivre les identités

Le laboratoire fournit les identifiants du login SQL local `kevin`. La chaîne est **login SQL → usurpation de `appdev` → lecture de `financial_planner` → mot de passe web retrouvé → réutilisation pour `adam.scott` → WinRM → création d’un dMSA dans l’OU Staff → BadSuccessor → ticket Kerberos privilégié**. `EXECUTE AS` dans SQL ne transforme pas `kevin` en compte Windows. La réutilisation du mot de passe et la connexion WinRM représentent d’autres transitions. L’étape dMSA dépend du système des contrôleurs de domaine, de leurs correctifs et des droits sur les objets.

Les mots de passe, hashes, tickets et flags sont omis. `eighteen.htb` désigne le laboratoire autorisé ; la version de tout outil utilisé doit être connue et son code examiné.

## Atteindre les données par l’usurpation SQL

L’énumération réseau montre MSSQL sur 1433, le site web et WinRM. Le compte `kevin` utilise l’authentification SQL. Un essai d’authentification intégrée au domaine peut échouer alors que le login SQL est valide. Dans une session SQL, lister les bases et les permissions :

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT name FROM sys.databases;
SELECT * FROM fn_my_permissions(NULL, 'SERVER');
```

La base `financial_planner` est visible mais inaccessible sous `kevin`. Voir son nom ne confère pas le droit de lire ses tables. Une vérification des grants révèle le droit d’usurper `appdev`, login de l’application. Changer de contexte puis refaire les tests :

```sql
EXECUTE AS LOGIN = 'appdev';
SELECT SYSTEM_USER AS effective_login, ORIGINAL_LOGIN() AS original_login;
USE financial_planner;
SELECT name FROM sys.tables;
REVERT;
```

`SYSTEM_USER` change, tandis que `ORIGINAL_LOGIN()` garde trace du compte qui a ouvert la connexion. `REVERT` restaure le contexte précédent. L’accès à `financial_planner` comme `appdev` démontre l’effet du grant d’usurpation. Microsoft documente [EXECUTE AS](https://learn.microsoft.com/en-us/sql/t-sql/statements/execute-as-transact-sql) et sa portée.

La table `users` contient un hash Werkzeug `pbkdf2:sha256` du compte administrateur web. Relever algorithme, nombre d’itérations, sel et format du digest avant de choisir un mode de recherche hors ligne. La représentation stockée ne correspond pas nécessairement directement à l’entrée du mode Hashcat 10900 ; une conversion doit préserver les octets et l’encodage. Les essais hors ligne ne lancent aucune connexion vers la cible. Une valeur retrouvée doit ensuite être vérifiée sur le compte de domaine réel. Dans ce laboratoire, le candidat fonctionne aussi pour `adam.scott`, autorisé à utiliser WinRM. `whoami` et les groupes de la session confirment l’identité Windows ; administrateur web et utilisateur de domaine restent deux principaux différents ayant le même secret.

Si le changement de contexte SQL échoue, vérifier la portée du grant, login ou utilisateur de base, et l’existence de `appdev` sur l’instance. Si le mot de passe fonctionne sur le site mais pas sur WinRM, regarder le domaine, le verrouillage, le groupe d’accès distant et l’éventuelle absence de réutilisation dans l’état actuel.

## Comprendre l’occasion créée par les dMSA

`adam.scott` a le droit de créer certains objets dans l’unité organisationnelle Staff. Le compte de service géré délégué, ou dMSA, est une fonction de Windows Server 2025 destinée à la migration des comptes de service. BadSuccessor apparaît lorsqu’un utilisateur peu privilégié peut créer ou modifier un dMSA et renseigner ses attributs de migration afin de désigner un prédécesseur puissant. Le KDC peut ensuite délivrer des tickets portant l’autorisation associée à ce prédécesseur. La [recherche technique initiale](https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory) décrit le mécanisme.

Avant toute modification, inventorier les contrôleurs et les ACL effectives de `OU=Staff,DC=eighteen,DC=htb`. Un droit général de créer des enfants compte seulement s’il permet le type d’objet voulu ; un refus spécifique ou un KDC corrigé peut changer le résultat. Identifier le contrôleur qui répond à la demande de ticket. Ces commandes en lecture sont possibles dans une session de domaine dotée du module ActiveDirectory :

```powershell
Get-ADDomainController -Filter * | Select-Object HostName,OperatingSystem,OperatingSystemVersion
Get-Acl 'AD:OU=Staff,DC=eighteen,DC=htb' | Select-Object -ExpandProperty Access
```

La seconde exige un lecteur AD PowerShell et la lecture de son descripteur de sécurité. Elle affiche des ACE, pas le calcul complet des droits effectifs du compte. Windows Server 2025 est un prérequis ; la présence de SQL Server 2022 n’informe pas sur les fonctions du KDC.

Un test dMSA contrôlé doit enregistrer les droits du créateur, l’objet créé, le prédécesseur choisi, l’état de migration et l’acceptation par le KDC. La voie du laboratoire désigne Administrator comme prédécesseur et demande un ticket pour le dMSA contrôlé. Création d’objet, demande de ticket et réplication d’annuaire sont trois opérations distinctes. Un outil qui annonce la création ne prouve pas l’obtention d’appartenances privilégiées. Contrôler les données d’autorisation du ticket et une opération de service effectivement acceptée. La réplication exige en outre des droits réels ; seule une réponse de réplication réussie établit cet impact.

## Tenir compte des correctifs

La relation de prédécesseur unilatérale de l’attaque d’origine fonctionne uniquement dans l’état vulnérable. L’[analyse du correctif CVE-2025-53779](https://www.akamai.com/blog/security-research/badsuccessor-is-dead-analyzing-badsuccessor-patch) rapporte que les KDC mis à jour la refusent. Une voie ultérieure exige le contrôle d’une relation réciproque, y compris de l’objet prédécesseur, donc d’autres permissions. Une demande unilatérale refusée sur un DC corrigé est une défense attendue, pas nécessairement un défaut de l’outil. Vérifier mises à jour cumulatives, DC sélectionné, réplication AD, ACL, horloge Kerberos, realm et SPN. Désactiver RC4 seul ne corrige pas un problème d’autorisation sur les attributs dMSA.

## Correction et test de régression

Mettre à jour tous les contrôleurs concernés et restreindre la création et la modification des OU, dMSA et objets prédécesseurs. Auditer les migrations légitimes, dont les attributs ressemblent aux modifications tentées par un attaquant. Renouveler les secrets issus de SQL et supprimer la réutilisation entre compte web et domaine. Réexaminer le grant d’usurpation de `kevin` et l’étendue des données de mot de passe accessibles à `appdev`.

Au retest, `kevin` ne doit pas lire `financial_planner` sous un contexte non autorisé, l’ancien secret ne doit plus ouvrir WinRM, un créateur peu privilégié ne doit pas recevoir les droits du prédécesseur dans un ticket, et une migration légitime doit rester possible. Conserver les changements d’objets et l’identité du KDC répondant. La surveillance doit corréler créations de dMSA, modifications des attributs de migration, tickets et demandes de réplication.
