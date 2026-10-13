---
id: "HTB-2026-EIGHTEEN"
title: "Eighteen"
excerpt: "BadSuccessor sur Windows Server 2025 : distinguer accès au compte, création dMSA, héritage des droits et comportement du KDC corrigé."
date: "2025-11-15"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "EASY", "DMSA", "BADSUCCESSOR", "KERBEROS-PAC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et preuves

Le récit d’Eighteen rapporte des identifiants `adam.scott`, un accès WinRM, des droits de création dans une OU staff et une extraction de clés du prédécesseur via un delegated Managed Service Account (dMSA) contrôlé.

Les transcripts d’authentification et d’ACL sont incomplets. Un succès SMB ne démontre pas l’autorisation WinRM ; la liste des ports HTTP et SQL omet aussi la découverte nécessaire à cette session. Cet article prend la session ultérieure comme un résultat rapporté et se concentre sur la frontière dMSA.

## Énumérer les droits effectifs et les correctifs

La [recherche initiale BadSuccessor](https://www.akamai.com/blog/security-research/abusing-dmsa-for-privilege-escalation-in-active-directory) décrit l’abus d’un dMSA contrôlé pour hériter des droits d’un prédécesseur. Des permissions spécifiques ou générales de création d’enfants sur une OU peuvent permettre de créer ce dMSA. Le support par un DC Windows Server 2025 est nécessaire ; SQL Server 2022 ne détermine pas la version du DC.

Cet inventaire PowerShell illustratif nécessite le module ActiveDirectory et une connexion autorisée au domaine :

```powershell
Get-ADDomainController -Filter * |
    Select-Object HostName, OperatingSystem, OperatingSystemVersion
```

Il relève les versions déclarées des DC, sans établir leurs correctifs ni les droits de l’appelant. Examiner séparément les ACL effectives de l’OU et des objets, puis les mises à jour du DC traitant l’authentification.

## Distinguer changements LDAP, tickets et clés

Le chemin initial nécessite le contrôle d’un dMSA, la définition du prédécesseur et de l’état de migration, puis les conditions permettant de s’authentifier comme ce dMSA. Créer l’objet ne suffit pas.

Le texte initial confondait les privilèges présents dans le Privilege Attribute Certificate (PAC) et les clés du prédécesseur retournées dans le package de clés dMSA. Hériter des droits et obtenir des clés sont deux résultats distincts. Une clé RC4 peut correspondre à un hash NT ; cela ne signifie pas que toute entrée est un hash NTLM.

Le lab rapporte une sortie de clés sans expliquer l’identité machine demandeuse ni la préparation du script. L’invocation incomplète de `getST.py` et la valeur de clé sont retirées. Une reproduction exige la version de l’outil, le principal demandeur, ses droits d’accès au dMSA, le DC choisi et la preuve d’acceptation, secrets masqués.

## Le correctif change les prérequis

[L’analyse du correctif CVE-2025-53779 par Akamai](https://www.akamai.com/blog/security-research/badsuccessor-is-dead-analyzing-badsuccessor-patch) rapporte le rejet, par le KDC corrigé, du lien unilatéral initial. Le chemin post-correctif testé nécessite une relation réciproque et le contrôle du compte prédécesseur. « Windows Server 2025 » ne suffit donc pas pour conclure que l’élévation initiale fonctionne.

Désactiver RC4 ne constitue pas une correction complète : supprimer une représentation de clé ne résout pas l’héritage de privilèges non autorisé. De même, un DCSync nécessite des droits de réplication dans le contexte obtenu et une preuve propre ; afficher des clés du prédécesseur ne le démontre pas.

## Remédiation, détection et retest

Installer les mises à jour applicables aux DC et limiter les droits d’écriture sur les OU, dMSA et comptes prédécesseurs. Examiner qui peut créer des comptes gérés et qui peut obtenir ou utiliser leurs identifiants.

Dans un annuaire de test isolé, vérifier qu’un créateur non privilégié ne peut plus s’authentifier via l’ancien lien unilatéral et que les modifications réciproques non autorisées échouent. Garder une migration légitime comme contrôle positif.

Avec une stratégie d’audit et des SACL adaptées, examiner la création des dMSA et les modifications des liens des deux côtés, en corrélant acteur, objet et authentification. Identifier l’objet réellement modifié plutôt que rechercher uniquement les changements d’Administrator. Un nouvel objet peut influencer les droits d’un principal existant ; l’état des correctifs détermine les conditions de cette attaque.
