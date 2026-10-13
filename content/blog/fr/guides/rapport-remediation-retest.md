---
id: GUIDE-2026-001
title: "Du constat au retest : rendre un rapport de pentest actionnable"
excerpt: "Un constat fictif d’export inter-tenant relie preuves, cause racine, impact, correction et critères de retest à un travail d’ingénierie vérifiable."
date: "2026-09-15"
updated: "2026-10-13"
tags: ["GUIDE", "REPORTING", "REMEDIATION", "RETEST", "PENTEST"]
category: "GUIDE"
icon: "Database"
author: "Romain Stride"
featured: true
published: true
---

Un constat doit permettre à un autre ingénieur de comprendre la défaillance, de la reproduire sur des données autorisées et de vérifier que la correction couvre ses variantes. Le nombre de pages et les sorties d’outils ne remplacent pas cette chaîne.

Le constat suivant est entièrement fictif. Domaines, identités, IDs, builds et réponses sont illustratifs, pas des observations client. Il utilise la politique de [l’article d’autorisation multi-tenant](/blog/autorisation-api-multitenant).

## Un titre qui décrit la conséquence

**Un administrateur peut exporter le rapport d’une autre organisation.**

Composant affecté : endpoint d’export et worker du build fictif `assessment-demo-1`. Prérequis : un compte admin valide dans A et un ID de rapport connu dans B. L’exemple ne démontre ni accès anonyme, ni modification, suppression ou compromission de domaine.

La politique réserve l’export à l’organisation de l’administrateur. L’observation est que l’implémentation d’exemple contrôle le rôle sans relier le rapport chargé à l’organisation appelante.

## Une preuve minimale mais complète

Créer A et B avec des données synthétiques. Capturer d’abord un export A1 légitime comme `admin_A`, puis soumettre B1 avec la même identité. `<TOKEN_ADMIN_A>` représente un jeton valide de cette identité de test :

```http
POST /api/organizations/A/reports/report_B1/exports HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_ADMIN_A>
Content-Type: application/json

{"format":"csv"}
```

Le comportement vulnérable fictif retourne `202` et un job. Cette réponse ne suffit pas : suivre le job et le téléchargement autorisé, puis montrer que l’artefact contient le marqueur préparé de B1, `tenant-b-demo`. Conserver corrélation requête/job/artefact et horodatages en masquant jetons et secrets de téléchargement.

Le dossier relève aussi la propriété de B1 avant la requête, les appartenances du compte et un contrôle positif de l’export A. Exporter les vraies données d’un client n’est pas nécessaire pour démontrer la rupture.

## Séparer observation, impact et incertitude

Observation : l’identité A obtient l’artefact B1. Impact démontré dans le scénario fictif : divulgation inter-tenant du contenu accessible par ce chemin d’export.

L’étendue potentielle dépend de la découverte d’objets, des données exportables, de la politique et des variantes. Un rapport ne prouve pas l’accès à toutes les données de tous les tenants. Une réponse de job sans artefact récupérable établit aussi une observation différente, plus limitée.

Prioriser selon exposition, privilèges requis, sensibilité, fiabilité et contrôles existants. L’exemple n’attribue pas de score sans contexte réel. La [description BOLA d’OWASP](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) donne la catégorie pertinente.

## Cause racine et trajectoire de correction

Le handler fictif valide un admin dans le tenant A du chemin, puis charge globalement le rapport par ID. Le worker fait confiance à cet ID en file. Le contrôle de rôle existe ; la relation identité–organisation–objet manque.

Une mesure immédiate peut désactiver l’export concerné. La correction durable autorise l’objet dans le contexte d’appartenance actuel avant mise en file, revérifie les droits pertinents avant production et protège le téléchargement. Examiner jobs en attente et liens déjà émis ; corriger seulement le handler laisse les traitements antérieurs actifs.

Centraliser la politique si adapté et examiner duplication, bulk, recherche et téléchargement pour le même chargement global. Un identifiant aléatoire renforce la défense sans remplacer l’autorisation.

## Définir la clôture avant de corriger

Utiliser un nouveau build et des données neuves pour le retest :

| Cas | Résultat requis |
| --- | --- |
| `admin_A` exporte A1 | job terminé ; artefact limité à A1 |
| `admin_A` demande B1 sous A ou B | refus ; aucun job ni artefact |
| `member_A` demande l’export A1 | refus selon la politique de rôle |
| lot contenant A1 et B1 | refus global ; aucun job partiel |
| appartenance admin révoquée après mise en file | le worker ne produit pas l’artefact |
| identité A télécharge un artefact B | refus ; aucune fuite de contenu ou métadonnée |

Le contrat d’exemple choisit `404` pour un objet étranger et `403` pour un rôle insuffisant dans le tenant. Une autre convention est possible, mais les contrôles d’effets de bord et de divulgation restent nécessaires.

## Conserver la décision et ses limites

Joindre build, date, identités de test, résultats originaux et variantes, ainsi que chemins worker/cache non évalués. Clôturer comme corrigé seulement si les critères passent. Employer « partiellement corrigé » si une frontière échoue encore et « non vérifié » si accès ou déploiement empêchent le retest ; un accès indisponible ne démontre pas la correction.

L’acceptation du risque est une décision distincte avec responsable, justification et date de revue. Garder cette distinction dans le ticket. Le rapport devient exploitable quand affirmations, actions et preuves de clôture répondent au même objectif. Le [guide de préparation SaaS](/blog/preparer-saas-pentest) explique comment préparer les accès nécessaires.
