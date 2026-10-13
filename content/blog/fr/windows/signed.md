---
id: "HTB-2025-011"
title: "Signed"
excerpt: "Accès MSSQL et falsification de tickets Kerberos : distinguer la compromission d’un compte de service d’un accès au contrôleur de domaine non étayé."
date: "2025-10-11"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MSSQL", "KERBEROS", "SILVER-TICKET", "MEDIUM"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "ShieldAlert"
author: "0x7CC"
published: true
---

## Chaîne étayée et limites

Le récit de Signed décrit l’obtention d’un identifiant de service MSSQL, une exécution de commandes depuis la base et une falsification de tickets Kerberos. Il ne fournit ni extraction de clé, ni correspondance compte/SPN, ni trace de validation réussie du ticket. Ces lacunes empêchent d’affirmer un accès Domain Admin complet.

La frontière importante sépare la compromission d’un compte de service de celle de la clé d’un autre service. Le hash NTLM d’un compte MSSQL n’est pas automatiquement la clé CIFS d’un contrôleur de domaine. La commande de falsification CIFS initiale est retirée car l’appartenance de la clé nécessaire n’était pas établie.

## Établir d’abord le contexte de la base

La cible est `signed.htb`, avec MSSQL sur TCP 1433. Le récit mentionne un password spraying sans jeu de candidats ni transcript d’authentification. Des identifiants valides constituent donc le point de départ ; un login SQL réussi n’implique pas des droits sur tout le domaine.

Ces requêtes en lecture seule illustrent les vérifications dans une session SQL authentifiée :

```sql
SELECT SYSTEM_USER AS login_name,
       IS_SRVROLEMEMBER('sysadmin') AS is_sysadmin;
SELECT name, value_in_use
FROM sys.configurations
WHERE name = 'xp_cmdshell';
```

Elles identifient l’appartenance du login SQL au rôle serveur et la configuration de l’exécution de commandes. Elles n’établissent ni l’identité du processus Windows, ni le droit d’activer cette fonctionnalité, ni l’extraction d’un secret. Relever ces éléments séparément. Microsoft décrit les [permissions et le contexte de xp_cmdshell](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).

## Comprendre les prérequis d’un Silver Ticket

Un Silver Ticket est un ticket de service falsifié. Il nécessite la clé durable du service cible pour un type de chiffrement utilisable, le bon principal et realm, ainsi que des données d’identité acceptées par le service. La validation des données d’autorisation et le durcissement du déploiement comptent aussi.

Microsoft explique qu’un ticket de service est protégé par la clé du serveur dans sa [documentation des tickets de session](https://learn.microsoft.com/en-us/windows/win32/secauthn/session-tickets). Falsifier un ticket pour un SPN MSSQL et pour CIFS constitue donc deux affirmations distinctes, sauf si les SPN concernés utilisent la même clé de compte compromise.

Un inventaire des SPN est nécessaire, mais leur lecture ne fournit pas leur clé. Posséder un ticket ne prouve pas non plus son acceptation. Un récit rigoureux relève le compte propriétaire, la provenance de la clé sans la divulguer, le service choisi, l’authentification acceptée et les droits obtenus.

## Impact et remédiation

La compromission du compte peut exposer les données SQL, permettre l’administration de la base ou une exécution système selon ses droits réels. L’administration du contrôleur de domaine reste non démontrée ici. Une authentification limitée à un service ne doit pas être présentée comme une élévation universelle dans le domaine.

Employer des comptes de service gérés lorsque possible, renouveler les clés compromises, limiter les droits SQL et système, et supprimer les SPN ou permissions d’exécution inutiles. Vérifier l’appartenance des SPN et les paramètres de chiffrement du déploiement ; un réglage de protocole isolé ne constitue pas une correction complète.

Après correction, vérifier que l’ancien identifiant échoue, que l’application fonctionne et que le service ne réalise plus d’opérations administratives hors de son rôle. Collecter les journaux d’authentification et d’accès du service. Un ticket falsifié peut être utilisé sans demande d’émission correspondante au KDC : ses journaux seuls ne démontrent pas l’absence de cette attaque.
