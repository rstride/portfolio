---
title: "PrismaSec"
summary: "Conception et mise en production d’une plateforme CTEM qui transforme des actifs publics vérifiés en risques priorisés, plans de remédiation et retests traçables."
role: "Fondateur, CEO & Lead Engineer"
period: "2025 — aujourd’hui"
tags: ["CTEM", "NEXT.JS", "RUST", "KUBERNETES", "SECURITY ENGINEERING"]
externalUrl: "https://prismasec.fr"
coverImage: "/projects/prismasec-product.webp"
coverAlt: "Visualisation publique PrismaSec représentant une surface d’attaque et ses contrôles de sécurité"
ogImage: "/projects/prismasec-og.png"
seoTitle: "PrismaSec : étude de cas CTEM | Romain Stride"
seoDescription: "Étude de cas sur la conception de PrismaSec : actifs vérifiés, scans contrôlés, priorisation du risque, remédiation, retests et architecture cloisonnée."
updated: "2026-09-29"
featured: true
published: true
---

## Le problème

Les équipes exposent des domaines, applications et API sans toujours disposer d’une lecture continue de ce qui est réellement exploitable. Les outils produisent souvent des signaux fragmentés : inventaire d’un côté, vulnérabilités de l’autre, puis des rapports difficiles à relier au travail de remédiation.

PrismaSec a été conçu pour réunir cette chaîne dans un même flux, sans confondre visibilité et autorisation de tester.

## Mon rôle

En tant que **fondateur, CEO et lead engineer**, j’ai porté la direction produit, l’architecture applicative et les contrôles de sécurité qui encadrent les opérations techniques. Mon travail couvre l’expérience client, les frontières entre services, l’orchestration CTEM, la livraison GitOps et la validation avant mise en production.

## Un flux conçu autour de l’autorisation

1. Un actif public est ajouté et son contrôle est vérifié.
2. Le périmètre et le consentement aux tests actifs sont explicités.
3. Les évaluations autorisées alimentent une vue unifiée de la surface d’attaque.
4. Les constats sont priorisés selon l’exposition, l’exploitabilité et l’impact.
5. La remédiation, les preuves et les retests restent reliés au même contexte.
6. Les rapports rendent les décisions compréhensibles aux équipes techniques et aux responsables.

Cette séquence réduit le risque qu’une capacité offensive soit déclenchée sur un actif non vérifié ou hors périmètre.

![Architecture publique et volontairement simplifiée de PrismaSec](/projects/prismasec-architecture.svg)

## Architecture cloisonnée

La plateforme sépare l’expérience client et les données métier du moteur CTEM :

- **Next.js et PostgreSQL** portent l’interface, l’authentification, la gestion des organisations, les abonnements et les API applicatives.
- Une **frontière de service authentifiée** contrôle les appels vers le moteur CTEM.
- Un service **Rust** orchestre les cycles, les workers et la normalisation des résultats.
- **SurrealDB** conserve les entités propres au domaine d’exposition et aux scans.
- **Kubernetes et GitOps** rendent les changements de production déclaratifs, vérifiables et réversibles.
- La supervision et les portes de validation accompagnent les déploiements et les opérations sensibles.

Le diagramme reste volontairement général : il présente les responsabilités et les flux, pas les détails opérationnels ou les mécanismes internes des scanners.

## Décisions structurantes

### Vérifier avant d’évaluer

La découverte d’un actif ne suffit pas à autoriser une action active. La vérification de propriété, le consentement explicite et les contrôles d’arrêt font partie du produit, pas d’une procédure externe.

### Isoler les organisations

Les autorisations et les accès aux données sont évalués dans le contexte de l’organisation. Les opérations sensibles demandent des contrôles supplémentaires, et les frontières de service évitent qu’une route applicative contourne le modèle d’accès.

### Relier constats et remédiation

Un constat utile doit être reproductible, priorisé et suivi jusqu’au retest. L’interface privilégie donc les chemins d’attaque, les preuves, les propriétaires et les prochaines actions plutôt qu’une simple accumulation d’alertes.

### Traiter la livraison comme un contrôle de sécurité

Les changements de production passent par une source GitOps, des images immuables, des validations de migration, des tests de contrat et des scénarios de restauration. La capacité à revenir en arrière fait partie de la conception du service.

## Ce que ce projet démontre

- Traduire des capacités offensives en un produit utilisable et encadré.
- Concevoir des frontières entre identité, données métier et orchestration technique.
- Construire une expérience qui relie exposition, décision, correction et preuve.
- Faire évoluer un système complet sans sacrifier la traçabilité de production.

PrismaSec est consultable publiquement ; cette étude de cas n’expose ni données client, ni détails d’infrastructure sensibles, ni métriques commerciales non vérifiées.
