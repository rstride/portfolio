---
id: RESEARCH-2026-002
title: "Tester l’autorisation d’une API multi-tenant au-delà des checklists"
excerpt: "Une matrice tenants et rôles, des requêtes, des transitions et du pseudocode de non-régression pour évaluer l’isolation d’une API multi-tenant."
date: "2026-09-22"
updated: "2026-10-13"
tags: ["RESEARCH", "API", "MULTI-TENANT", "AUTHORIZATION", "BOLA"]
category: "RESEARCH"
icon: "Code"
author: "Romain Stride"
featured: true
published: true
---

L’autorisation multi-tenant relie une identité authentifiée, ses appartenances actuelles, un objet et une action. Tester une requête réussie par endpoint laisse cette relation largement inexplorée.

Cet article développe un exemple synthétique, pas un constat client ni une découverte de vulnérabilité inédite. Domaines, identités, objets et réponses sont fictifs. La méthode transforme la politique produit en contrôles positifs et négatifs utilisables après correction.

## Commencer par une politique explicite

Notre service stocke des rapports pour A et B. Un membre peut lire les rapports de son organisation et modifier ses propres brouillons. Un administrateur peut publier et exporter les rapports de son organisation. Aucun rôle ne peut accéder à l’autre organisation. L’exemple ne prévoit ni liens publics ni exceptions de support.

Préparer des sessions indépendantes pour `member_A`, `admin_A` et `member_B`, avec ces données :

| Objet | Contexte |
| --- | --- |
| `report_A1` | A ; propriétaire `member_A` ; draft |
| `report_A2` | A ; propriétaire `admin_A` ; published |
| `report_B1` | B ; propriétaire `member_B` ; draft |

La matrice attendue est :

| Acteur | Actions A1 permises | Lire B1 |
| --- | --- | --- |
| `member_A` | lire, modifier | refusé |
| `admin_A` | lire, publier, exporter | refusé |
| `member_B` | aucune | autorisé |

Les actions A1 non listées sont refusées.

Le refus de modification pour l’admin est volontaire : notre politique réserve l’édition au propriétaire. Adapter la matrice au contrat produit, sans supposer qu’« admin » autorise toute action.

## Établir une requête légitime puis varier une dimension

La requête suivante est illustrative. `<TOKEN_MEMBER_A>` représente un jeton de test valide pour `member_A` dans A :

```http
GET /api/organizations/A/reports/report_A1 HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_MEMBER_A>
```

Le résultat attendu est `200` avec les données d’A1. Conserver le jeton et changer seulement l’objet :

```http
GET /api/organizations/A/reports/report_B1 HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_MEMBER_A>
```

Cet exemple choisit `404`, sans donnée ni métadonnée de B1. Un `403` peut aussi correspondre à une politique ; l’invariant est le refus sans divulgation involontaire. Changer ensuite l’organisation du chemin vers B en conservant le jeton, puis tester B1 comme `admin_A`. Le rôle admin ne doit pas supprimer la frontière de tenant.

Des IDs prévisibles ne sont pas nécessaires : deux comptes légitimes fournissent des IDs connus. La [description BOLA d’OWASP](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) désigne le défaut de contrôle sur l’objet, pas le simple format de son identifiant.

## Tester les sources de contexte contradictoires

Une organisation peut apparaître dans le chemin, le jeton, un en-tête et le corps. Documenter le sens prévu de chaque source. Résoudre appartenance et propriété côté serveur avant d’agir ; vérifier seulement que l’appelant appartient au tenant A du chemin n’autorise pas un objet chargé depuis B.

Pour les écritures, utiliser des données jetables et comparer avant/après. Soumettre un tenant contradictoire dans le corps, une référence d’objet étranger et un lot mélangeant les tenants. Ici, le traitement bulk est atomique : un objet étranger provoque un refus sans modification d’aucun élément. Tester ce contrat sans le déduire du code HTTP.

## Suivre les transitions et traitements différés

Une lecture protégée ne prouve pas l’isolation de la publication, duplication, export ou téléchargement. Parcourir le cycle de vie :

- `member_A` modifie son brouillon mais ne peut le publier.
- `admin_A` publie A1 ; son propriétaire ne peut plus le modifier comme brouillon.
- Retirer `member_A` de A révoque les lectures suivantes, même avec un jeton non expiré.
- Le worker d’export doit revérifier les droits avant de produire l’artefact si l’appartenance change après la mise en file. Le téléchargement applique sa propre politique.
- Une invitation révoquée ne doit pas créer d’appartenance lors du rejeu de son ancien lien.

Observer workers et artefacts, pas seulement la réponse initiale. Les caches partagés doivent préserver la même isolation identité/tenant lors d’un hit et d’un miss.

## Transformer la politique en non-régression

Ceci est du pseudocode : `fixtures`, `client` et `store` représentent les helpers de test applicatifs, pas une bibliothèque exécutable. Chaque cas part de données neuves. `object_snapshot` comprend état métier et version ; les événements d’audit sont contrôlés séparément. `read_cases` fournit acteur, organisation du chemin, ID et code attendu selon la matrice. `leaks_object_data_or_metadata` examine corps et en-têtes pour détecter contenu, noms et identifiants de l’objet étranger.

```python
for actor, organization, object_id, expected in read_cases:
    response = client(actor).get_report(organization, object_id)
    assert response.status == expected
    if expected == 200:
        assert response.json["id"] == object_id
    else:
        assert not leaks_object_data_or_metadata(response)

before = store.object_snapshot("report_A1")
response = client("member_A").publish("A", "report_A1")
assert response.status == 403
assert store.object_snapshot("report_A1") == before
assert not store.has_publish_job("report_A1")
```

Inclure les contrôles positifs : une route cassée ou une dépendance indisponible ne doit pas passer pour une bonne isolation. La [fiche d’autorisation OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommande des contrôles cohérents et des tests de comportement.

## Définir ce que le résultat démontre

Relever acteur, appartenances effectives, provenance de l’objet, requête, réponse, effets de bord, build et date. Une requête refusée avec un export déjà en file constitue un échec ; une route corrigée ne démontre pas l’isolation de tout l’objet.

Pour préparer les accès, utiliser la [checklist de pentest SaaS](/blog/preparer-saas-pentest). Pour documenter une défaillance et sa clôture, voir [le guide constat-remédiation-retest](/blog/rapport-remediation-retest). Le livrable utile est un ensemble d’observations reliées à la politique, avec les parties non testées.
