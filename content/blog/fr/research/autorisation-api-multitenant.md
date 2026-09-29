---
id: RESEARCH-2026-002
title: "Tester l’autorisation d’une API multi-tenant au-delà des checklists"
excerpt: "Une méthode centrée sur les objets, les transitions et les invariants pour détecter les ruptures d’isolation que les tests endpoint par endpoint manquent souvent."
date: "2026-09-22"
tags: ["RESEARCH", "API", "MULTI-TENANT", "AUTHORIZATION", "BOLA"]
category: "RESEARCH"
icon: "Code"
author: "Romain Stride"
featured: true
published: true
---

Les failles d’autorisation multi-tenant apparaissent rarement sous la forme d’un unique endpoint manifestement public. Elles émergent plutôt d’une incohérence entre plusieurs opérations, rôles ou états d’un même objet.

## Modéliser avant de tester

Commencez par une matrice : organisations, utilisateurs, rôles, types d’objets et actions. Pour chaque action, notez qui peut créer, lire, modifier, supprimer, partager, exporter ou administrer l’objet.

Cette matrice transforme une liste de routes en invariants testables. Par exemple : « un administrateur de l’organisation A ne peut jamais rattacher un rapport de B à son propre espace ».

## Utiliser plusieurs identités simultanément

Deux tenants et trois identités de test constituent une base utile : utilisateur A, administrateur A et utilisateur B. Conservez des sessions distinctes et capturez les identifiants créés dans chaque contexte.

Rejouez ensuite les opérations en changeant une seule dimension à la fois : identifiant d’objet, tenant explicite, rôle, méthode HTTP, représentation du corps ou étape du workflow.

## Tester les transitions, pas uniquement les lectures

Une lecture correctement protégée ne garantit pas la sécurité des opérations secondaires. Les routes d’export, de duplication, d’invitation, de commentaire, de téléchargement, de recherche ou d’action en masse réutilisent parfois des contrôles différents.

Les transitions d’état sont particulièrement importantes : brouillon vers publié, membre vers administrateur, actif non vérifié vers vérifié, ou constat ouvert vers corrigé.

## Rechercher les sources d’autorité concurrentes

Une API peut recevoir le tenant dans le jeton, le chemin, le corps et la base de données. Si ces sources ne sont pas résolues selon une règle unique, un attaquant peut provoquer une confusion de contexte.

Le contrôle doit porter sur la relation entre l’identité, l’organisation et l’objet chargé côté serveur. Masquer un champ dans l’interface ou vérifier seulement un identifiant transmis par le client ne suffit pas.

## Valider les invariants négatifs

Un bon test ne vérifie pas seulement qu’une action autorisée réussit. Il vérifie qu’une action interdite échoue sans divulguer le contenu ni les métadonnées de l’objet. Si son existence est sensible, la réponse ne doit pas non plus la révéler.

Automatisez ces invariants dans les tests de contrat : même identifiant, identités différentes, résultat refusé. Les corrections deviennent alors durables plutôt que limitées à un endpoint.

## Points de contrôle

- Identifiants prévisibles et opaques
- Opérations secondaires et bulk
- Filtres, recherche et exports
- Webhooks, tâches asynchrones et fichiers
- Changements de rôle et invitations
- Caches partagés
- Routes administratives et support
- Différences entre API REST et GraphQL

L’objectif n’est pas de multiplier les requêtes au hasard, mais de démontrer que les règles d’isolation restent vraies à travers tout le cycle de vie des objets.

Pour aller plus loin : [OWASP API1:2023 — Broken Object Level Authorization](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/).
