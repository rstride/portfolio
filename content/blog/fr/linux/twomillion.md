---
id: "HTB-2026-TWOMILLION"
title: "TwoMillion"
excerpt: "TwoMillion relie découverte des invitations, changement de rôle interdit, injection VPN, réutilisation d’identifiants et frontière de privilèges OverlayFS."
date: "2025-09-20"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "API-BYPASS", "COMMAND-INJECTION", "CVE-2023-0386"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et preuves

Le récit de TwoMillion décrit une inscription via un workflow découvrable, une modification administrative interdite, l’exécution via la génération VPN, une réutilisation SSH et CVE-2023-0386.

La requête administrative explique l’autorisation ; session d’inscription complète, requête d’injection et compilation de l’exploit sont absentes. Les exemples identifient les frontières sans inventer un transcript complet.

## Découvrir une invitation ne prouve pas un contournement

Le nom est `2million.htb`. Le frontend indique `POST /api/v1/invite/how/to/generate` et `POST /api/v1/invite/generate`. ROT13 et base64 sont des encodages, pas des contrôles d’accès.

Appeler la génération ne prouve pas seul le contournement d’une politique. Établir qui peut générer les invitations et ce que contrôle le serveur. L’inscription fournit une session ordinaire, pas l’administration.

## Les paramètres franchissent une frontière de rôle

Cette illustration normalisée conserve la modification décrite ; ce n’est pas un échange capturé :

```http
PUT /api/v1/admin/settings/update HTTP/1.1
Host: 2million.htb
Cookie: <LAB_SESSION_COOKIE>
Content-Type: application/json

{"email":"test@2million.htb","is_admin":1}
```

`<LAB_SESSION_COOKIE>` est la valeur complète de l’en-tête cookie d’un compte ordinaire du lab autorisé. Confirmer persistance et opération admin ultérieure ; un `200` seul ne prouve pas l’élévation.

Examiner les droits d’appeler la fonction et de modifier `is_admin` sur le compte choisi. OWASP distingue [autorisation de fonction](https://api-security.owasp.org/editions/2023/en/0xa5-broken-function-level-authorization/) et [de propriété](https://api-security.owasp.org/editions/2023/en/0xa3-broken-object-property-level-authorization/).

## Génération VPN et autre identité système

Le récit rapporte une injection via `username` dans `POST /api/v1/admin/vpn/generate`, donnant `www-data`. Sans invocation ni payload, la frontière shell exacte n’est pas reproductible. Examiner interpolation ou passage d’arguments, y compris les options propres à l’utilitaire.

La lecture du `.env` fournit des identifiants rapportés comme réutilisés en SSH pour `admin`. Permissions SQL, lecture du fichier et acceptation SSH sont distinctes. Administrateur applicatif et compte système `admin` sont aussi deux identités différentes.

## OverlayFS : vérifier plus que la version

Le récit relève Ubuntu 22.04 et `5.15.70-051570-generic`, puis un exploit FUSE/OverlayFS. CVE-2023-0386 concerne copy-up et mapping UID pouvant conserver à tort des propriétés privilégiées. Voir [l’avis Ubuntu et l’état des paquets](https://ubuntu.com/security/CVE-2023-0386).

Inventaire local illustratif :

```bash
uname -r
findmnt -t overlay,fuse,fuseblk
```

Ces commandes identifient noyau actif et montages visibles, pas tous les prérequis. Vérifier provenance, backports, politique de namespaces/montages, comportement du système de fichiers et source de l’exploit. Les deux noms d’exécutables initiaux ne constituent pas des instructions complètes et sont retirés.

## Remédiation et non-régression

Autoriser fonctions administratives et champs privilégiés côté serveur. Tirer l’identité de la session, limiter les champs modifiables et vérifier le compte cible. Lancer l’utilitaire VPN sans shell, avec arguments validés et droits minimaux.

Vérifier qu’un compte ordinaire ne change ni son rôle ni celui d’un autre, que l’admin légitime fonctionne et que les métacaractères ne lancent pas une autre commande. Renouveler les secrets et retirer la réutilisation. Installer le noyau corrigé, redémarrer et confirmer la version active selon l’éditeur.

Surveiller changements de rôle, processus enfants web inattendus et fichiers privilégiés associés aux montages. Le risque vient de la composition des faiblesses, pas d’un encodage d’invitation ou d’un noyau semblant ancien.
