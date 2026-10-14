---
id: "HTB-2026-DARKZERO"
title: "DarkZero"
excerpt: "Suivre un lien MSSQL jusqu’à l’exécution Windows et l’élévation SYSTEM locale, en précisant les limites de l’affirmation de compromission inter-forêts."
date: "2025-10-04"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "HARD", "CROSS-FOREST", "MSSQL-LINK", "CVE-2024-30088"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "HARD"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et conditions initiales

DarkZero est un lab assume-breach : des identifiants `john.w` sont fournis au départ. Le récit existant décrit un lien `SQL07` vers `DC02` dans une seconde forêt, un accès administratif SQL via ce lien, une exécution comme `svc_sql` puis une élévation locale SYSTEM.

Il affirme aussi une délégation de TGT inter-forêts et une compromission de forêt sans documenter les paramètres de confiance nécessaires, le ticket délégué ni l’authentification finale. Ces résultats ne sont pas établis ici. Le sujet étayé est la frontière de confiance SQL, suivie d’une élévation Windows locale.

## Énumérer le login distant , pas seulement le lien

Dans une session SQL authentifiée, ces requêtes illustratives en lecture seule identifient le lien et le contexte SQL distant :

```sql
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
EXEC ('SELECT SYSTEM_USER AS login_name,
       IS_SRVROLEMEMBER(''sysadmin'') AS is_sysadmin;') AT [SQL07];
```

`SQL07` est le nom rapporté dans le lab. La seconde requête nécessite RPC OUT et un mapping utilisable ; son échec ne prouve pas l’impossibilité de toute requête liée. Relever le login local, son mapping, le login distant et le résultat du contrôle de rôle.

Une connexion inter-forêts peut utiliser un login distant fixe, sans délégation d’identifiants Windows. Voir la [documentation Microsoft des mappings](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addlinkedsrvlogin-transact-sql). L’existence d’un lien ne prouve pas des droits administratifs.

## Des droits SQL à l’exécution Windows

Le récit décrit l’activation distante de `xp_cmdshell` et une exécution comme `darkzero-ext\svc_sql`. Cette étape passe des permissions de base de données au compte système du service. Le rôle SQL `sysadmin` et l’identité Windows SYSTEM sont distincts.

Si l’exécution est déjà activée et autorisée, cette vérification illustrative relève l’identité :

```sql
EXEC ('EXEC master..xp_cmdshell ''whoami'';') AT [SQL07];
```

Elle contrôle l’identité Windows au lieu de la déduire du login SQL. Microsoft décrit les [contextes de service et proxy de xp_cmdshell](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql). Le récit initial ne contient pas l’invocation complète du stager ; aucun transcript n’est reconstruit ici.

## Élévation locale et frontière du domaine

Le lab rapporte une élévation via CVE-2024-30088. Vérifier le build Windows exact, les mises à jour cumulatives, l’architecture et les prérequis de l’exploit ; « Windows Server 2022 » ne suffit pas pour conclure. La référence de correction est la [fiche de mise à jour Microsoft](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30088).

Le récit rapporte `NT AUTHORITY\SYSTEM`, sans établir une opération ultérieure à l’échelle de la forêt. La mention d’un dump SAM local sur un hôte nommé `DC02` doit aussi être clarifiée : les secrets du domaine et la SAM locale d’un serveur membre ordinaire sont des sources de preuve différentes.

## Remédiation et critères de clôture

Supprimer les mappings trop larges et n’autoriser que les opérations distantes nécessaires. Restreindre RPC OUT si inutile. Exécuter SQL sous un compte dédié peu privilégié, désactiver l’exécution système inutile et corriger le build Windows concerné.

Vérifier que le login initial ne rejoint plus un contexte administratif distant, tout en conservant les requêtes légitimes. Tester séparément les contextes SQL local et distant. Confirmer la mise à jour après redémarrage. Examiner les trusts et la délégation dans une évaluation distincte : le patch ne démontre pas l’isolation des forêts.

Surveiller les mappings distants, les activations d’exécution de commandes et les processus enfants inhabituels de SQL Server. Relier la session SQL au processus Windows explique mieux le chemin qu’une capture de shell seule.
