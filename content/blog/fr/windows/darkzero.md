---
id: "HTB-2026-DARKZERO"
title: "DarkZero"
excerpt: "DarkZero franchit trois frontières distinctes : un compte SQL lié dans une autre forêt, une élévation locale Windows et la délégation Kerberos à travers une relation d’approbation particulière."
date: "2025-10-04"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "HARD", "CROSS-FOREST", "MSSQL-LINK", "CVE-2024-30088"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "HARD"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Point de départ

DarkZero est un laboratoire avec accès initial fourni. Le scénario donne des identifiants valides pour `john.w` dans `darkzero.htb`. La chaîne est **SQL sur DC01 → lien vers DC02 dans `darkzero.ext` → `sysadmin` SQL distant → exécution OS comme `svc_sql` → SYSTEM sur DC02 → TGT délégué de DC01 → réplication de l’annuaire `darkzero.htb`**. La dernière étape exige une configuration précise de la relation d’approbation et un ticket de contrôleur de domaine. Devenir SYSTEM sur DC02 seul ne compromet pas la première forêt.

Les identifiants, tickets et flags sont retirés. `DC01.darkzero.htb` et `DC02.darkzero.ext` désignent deux machines de forêts différentes. Exécuter les exemples uniquement dans le laboratoire autorisé et noter l’hôte et le principal qui produisent chaque résultat.

## Suivre le serveur lié

Vérifier d’abord l’authentification du compte fourni sur MSSQL de DC01, puis lister les liens et leurs mappages. Le lien se nomme `DC02.darkzero.ext` ; employer ce nom exact dans les requêtes liées. Ces requêtes en lecture se lancent dans la première session SQL :

```sql
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
EXEC ('SELECT SYSTEM_USER AS remote_login,
       IS_SRVROLEMEMBER(''sysadmin'') AS is_sysadmin') AT [DC02.darkzero.ext];
```

La requête distante nécessite RPC OUT et un mappage utilisable. Dans ce laboratoire, `john.w` est mappé vers `dc01_sql_svc` sur DC02, avec le rôle distant `sysadmin`. Le serveur lié demande à une autre instance SQL de travailler : ces droits appartiennent au **login SQL distant**, sans devenir automatiquement des droits Active Directory pour `john.w`. Microsoft décrit les [mappages des comptes liés](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addlinkedsrvlogin-transact-sql).

Le rôle `sysadmin` distant peut activer `xp_cmdshell` sur DC02 si nécessaire. Un appel contrôlé à `whoami` révèle alors `darkzero-ext\svc_sql` comme identité Windows. Le test de rôle établit l’autorisation SQL ; `whoami` établit le jeton qui lance le processus. `svc_sql` n’est pas SYSTEM. La [documentation de xp_cmdshell](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql) décrit le rôle du compte de service.

Si l’appel au lien échoue, contrôler son nom exact, `is_rpc_out_enabled`, le mappage distant, le mode d’authentification et la connectivité de DC01 vers DC02. Une connexion réussie à DC01 ne garantit aucune de ces conditions.

## Obtenir et confirmer SYSTEM sur DC02

Plusieurs voies locales sont documentées entre `svc_sql` et SYSTEM. L’une utilise CVE-2024-30088 après identification du build Windows et des mises à jour installées. L’[entrée Microsoft](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30088) indique le correctif de référence. Un rejeu doit préciser build, mise à jour cumulative, architecture et outil utilisé. La seule mention « Windows Server 2022 » ne suffit pas. Une autre voie repose sur les droits d’ouverture de session comme service et le comportement des jetons ; elle a d’autres prérequis. Il faut vérifier séparément la voie choisie au lieu de mélanger leurs commandes.

La voie des jetons commence par une observation différente de celle de la CVE du noyau. Examiner le jeton courant avec `whoami /all` et l’attribution locale du droit `SeServiceLogonRight`. Dans ce laboratoire, `svc_sql` peut ouvrir une session de service, alors que la session interactive ou réseau en cours n’expose pas le privilège d’usurpation utile à une technique de tube nommé. Lancer un processus contrôlé sous le type de session service peut fournir un jeton avec `SeImpersonatePrivilege` ; le test d’usurpation devient alors pertinent. Un droit présent dans la stratégie n’est pas automatiquement actif dans le processus courant. Contrôler le nouveau jeton avant cette voie, puis vérifier SYSTEM à la fin. Cette transition est distincte de CVE-2024-30088 et exige son propre retest des droits de connexion et du jeton.

Après élévation, `whoami /all` confirme le jeton et ses privilèges. Une invite de commandes ou le message « exploit réussi » constituent des preuves plus faibles. Les changements administratifs sur DC02 touchent d’abord `darkzero.ext` : ils ne confèrent pas directement une autorité dans `darkzero.htb`, ni par filtrage des SID ni par le compte SQL lié.

## Vérifier la relation d’approbation et le ticket

La transition entre forêts exige une relation bidirectionnelle qui autorise la délégation des TGT. Dans le laboratoire, elle comporte `CROSS_ORGANIZATION_ENABLE_TGT_DELEGATION`, tandis que le filtrage des SID reste actif. Ces paramètres ont des rôles différents : la délégation laisse parvenir un TGT transféré à un service de l’autre forêt ; le filtrage limite les données d’autorisation traversant la relation. Constater simplement qu’une relation existe ne suffit pas. Examiner ses attributs et sa configuration de délégation avant d’attendre un ticket. La [spécification Microsoft](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/) donne le contexte du protocole.

Avec SYSTEM sur DC02, inspecter les tickets en cache. Les tickets ordinaires de `darkzero.ext` n’établissent aucun contrôle de `darkzero.htb`. Le ticket recherché est un TGT transféré appartenant à `DC01$`, compte machine de la **première** forêt. La voie du laboratoire attend ce ticket, puis provoque une authentification de DC01 vers un service de DC02, par exemple en demandant au SQL de DC01 d’accéder à un chemin UNC sur DC02 avec `xp_dirtree`. L’appel doit être lancé dans le contexte SQL de DC01, et non sur le serveur lié distant. Contrôler l’hôte source, le principal, les attributs de la relation, le service destinataire et l’identité indiquée par le ticket reçu.

Le TGT `DC01$` permet de demander des tickets de service comme ce compte machine. Un contrôleur de domaine dispose normalement de droits de réplication ; une requête de réplication contre `darkzero.htb` peut alors révéler ses secrets. Il s’agit encore d’un test de permission : un fichier de ticket créé ne prouve pas que l’annuaire a accepté la réplication. Il faut une authentification Kerberos acceptée dans la bonne forêt et une réponse d’annuaire réussie. Décalage horaire, mauvais realm ou SPN et routage à travers le pivot peuvent faire échouer l’étape. Le parcours documenté n’atteint l’administration de DC01 qu’après ces vérifications.

Trois identités Kerberos doivent rester distinctes ici : l’utilisateur à l’origine de la session SQL, le compte du service SQL qui émet la demande réseau et le principal machine DC01 représenté dans le ticket transféré. Une recherche UNC réussie prouve seulement une tentative d’authentification réseau ; elle ne nomme pas le ticket délégué. Dans le cache de DC02, examiner le principal client et le service visé. Un ticket de referral inter-realm et un TGT transféré n’ont pas le même usage : la réplication finale requiert des identifiants utilisables comme `DC01$` dans `darkzero.htb`. Les attributs de délégation comptent ainsi davantage que la simple existence d’une relation bidirectionnelle. Pour documenter un rejeu, relever le sens de la demande et le contrôleur qui traite l’opération d’annuaire finale. Ces détails distinguent le vrai franchissement de forêt d’une administration limitée à DC02.

## Prouver le franchissement de forêt

| Étape | Vérification | Ce qui reste à démontrer |
| --- | --- | --- |
| Requête SQL liée | Le résultat distant indique `dc01_sql_svc` et `sysadmin` sur DC02. | Cela ne définit pas les droits Windows de `john.w` dans les deux forêts. |
| Commande OS sur DC02 | `whoami` renvoie `darkzero-ext\svc_sql`. | Ce compte n’est ni SYSTEM ni un identifiant de contrôleur de domaine. |
| Élévation locale | `whoami /all` annonce SYSTEM et les privilèges attendus sur DC02. | SYSTEM dans la seconde forêt ne franchit pas seul la relation d’approbation. |
| Délégation | Les attributs autorisent la délégation du TGT et le service reçoit un TGT transféré de `DC01$`. | Un simple ticket de service ou un TGT de `darkzero.ext` ne convient pas. |
| Réplication | Le compte machine de DC01 est accepté par l’annuaire `darkzero.htb` et l’opération demandée aboutit. | Un fichier ticket présent sur disque ne prouve aucun droit de réplication. |

Cet ordre évite de confondre les catégories. `xp_dirtree` sur DC01 peut provoquer une demande réseau de son contexte de service vers DC02, mais la connexion n’est qu’un début. Le transfert dépend de l’attribut de délégation de la relation, du compte et du SPN du service, puis du service destinataire. Après l’appel, examiner le cache des tickets sur DC02 et relever principal client et realm au lieu de supposer que tout nouveau ticket est utile. Si rien n’arrive, vérifier que l’appel est parti de DC01, la possibilité de transfert, l’horloge et le réseau. Si le TGT `DC01$` apparaît mais que la réplication échoue, analyser séparément l’authentification acceptée et les droits d’annuaire. Voilà pourquoi une commande SQL réussie ou une invite SYSTEM sur DC02 ne suffisent pas à conclure.

## Corriger et retester

Supprimer les mappages de serveurs liés trop larges, désactiver RPC OUT quand il n’est pas requis et éviter qu’un utilisateur ordinaire devienne administrateur SQL distant. Garder `xp_cmdshell` désactivé hors opération revue et réduire les droits OS des comptes SQL. Corriger DC02 avec la mise à jour Windows applicable et vérifier le build installé.

Revoir la relation de forêt et désactiver la délégation interforêt des TGT si aucun usage approuvé ne l’exige. Conserver le filtrage des SID, limiter les chemins d’authentification provoquée et surveiller les changements de relation, les exécutions SQL liées, les sorties SMB, les tickets délégués et les demandes de réplication. Au retest, `john.w` ne doit plus obtenir l’administration SQL distante, le service SQL ne doit plus lancer de commandes privilégiées, un compte faible ne doit pas devenir SYSTEM et le ticket de DC01 ne doit pas être transféré à un hôte non autorisé. Tester chaque frontière séparément évite qu’une correction masque une autre faiblesse.
