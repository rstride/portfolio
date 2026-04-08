# Blog Writeup Template (Portfolio)

Use this file as a copy/paste base for a new post.

## 1) Create the post files

- French: `content/blog/fr/<slug>.md`
- English (optional but recommended): `content/blog/en/<slug>.md`

`<slug>` should be lowercase with hyphens, for example: `idor-multi-tenant-api`.

## 2) Frontmatter template

```md
---
id: "REQ-YYYY-NNN"
title: "Titre du writeup"
excerpt: "Résumé court (1 phrase) affiché dans la liste du blog."
date: "YYYY-MM-DD"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "WEB", "API"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "ShieldAlert"
author: "0x7CC"
---
```

## 3) Body template

```md
## Contexte

Décrivez rapidement l'application, la surface d'attaque, et les hypothèses de départ.

## Impact

- Ce qu'un attaquant peut obtenir
- Niveau de privilège requis
- Données/systèmes affectés

## Vulnérabilité

Expliquez la cause racine (erreur logique, validation insuffisante, trust boundary cassée, etc.).

## Reproduction

### Étape 1: Requête légitime

```http
GET /api/example HTTP/1.1
Host: target.tld
Authorization: Bearer <token>
```

### Étape 2: Requête malveillante

```http
GET /api/example?user_id=42 HTTP/1.1
Host: target.tld
Authorization: Bearer <token>
```

### Résultat observé

Décrivez la réponse et pourquoi elle confirme la faille.

## Preuve technique

Ajoutez ici payloads, extraits de réponses, ou snippets de code.

```javascript
// Exemple de code vulnérable
```

## Remédiation

- Correctif applicatif
- Mesures de défense en profondeur
- Tests à ajouter pour éviter la régression

```javascript
// Exemple de correctif
```

## Leçons retenues

Résumez en 2-4 points actionnables.
```

## 4) Allowed values / conventions

- `icon` (mapped in UI): `Database`, `Terminal`, `ShieldAlert`, `Code`
- `id` format used in current posts: `REQ-<year>-<index>`
- Taxonomy (recommended):
- `category`: `WRITEUP`
- `platform`: `HACKTHEBOX` or `TRYHACKME`
- `target_os`: `LINUX` or `WINDOWS`
- `difficulty`: `EASY`, `MEDIUM`, `HARD`, `INSANE`
- Keep the same values duplicated in `tags` so the current UI filters can use them directly.

## 5) Publishing checklist

- Slug is the same in `fr/` and `en/`
- Date is ISO format: `YYYY-MM-DD`
- Excerpt is concise and readable in card view
- Tags include at least: `WRITEUP`, platform, OS, and difficulty
- Code blocks specify language (for highlighting)
