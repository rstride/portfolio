---
id: "HTB-2026-SNAPPED"
title: "Snapped"
excerpt: "Fuite de sauvegarde Nginx UI et nettoyage des namespaces snapd : prérequis, limites des preuves et vérification des correctifs par distribution."
date: "2026-03-23"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "BACKUP-DISCLOSURE", "NGINX-UI", "CVE-2026-3888"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne d’attaque et prérequis

Le récit de Snapped rapporte la découverte de `admin.snapped.htb`, le téléchargement d’une sauvegarde Nginx UI, la récupération du mot de passe de `jonathan`, un accès SSH et une élévation snapd. Deux frontières distinctes sont franchies : l’accès web non authentifié aux secrets d’une sauvegarde, puis l’accès local à une gestion privilégiée des namespaces.

Le récit ne conserve ni requête complète, ni format de hash, ni transcript de récupération, ni source de l’exploit local. Les connexions réussies et l’accès root sont des résultats rapportés du lab, pas une reproduction établie indépendamment par cet article.

## Sauvegarde : la clé accompagne le contenu chiffré

Le récit identifie `/api/backup` et l’en-tête `X-Backup-Security`. [L’avis Nginx UI pour CVE-2026-27944](https://github.com/0xJacky/nginx-ui/security/advisories/GHSA-g9w5-qffc-6762) décrit l’absence d’authentification et l’envoi d’une clé AES et d’un IV encodés en base64 avec l’archive. Il indique 2.3.3 comme version corrigée ; son tableau de versions affectées et la version 2.3.2 rapportée dans le lab ne permettent pas une conclusion fiable fondée sur la version seule. Vérifier la route déployée et son middleware.

Cette requête est illustrative, sans réponse capturée :

```http
GET /api/backup HTTP/1.1
Host: admin.snapped.htb
```

Lors d’une reproduction contrôlée, relever si une requête non authentifiée obtient l’archive, si les clés l’accompagnent et quelles données contiennent les membres déchiffrés. Le chiffrement ne protège pas contre un destinataire recevant aussi la clé. Distinguer l’archive extérieure de ses membres chiffrés ; déchiffrer directement tout le téléchargement peut échouer.

Le récit rapporte ensuite la récupération des identifiants `jonathan` dans la base et leur réutilisation SSH. Confirmer le format stocké avant de choisir le mode de cracking. Récupération du mot de passe et acceptation SSH sont deux observations distinctes.

## Élévation locale : le nettoyage est un prérequis

CVE-2026-3888 concerne la recréation d’un répertoire temporaire privé de snap après son nettoyage par `systemd-tmpfiles`. La configuration de nettoyage concernée est nécessaire ; la présence de snapd ne suffit pas. Le lab rapporte `2.63.1+24.04` et un exploit dépendant du timing, sans détails de compilation et d’exécution permettant un rejeu. Voir [l’avis Ubuntu](https://ubuntu.com/security/CVE-2026-3888).

Ces commandes illustratives s’exécutent dans la session SSH déjà établie :

```bash
dpkg-query -W -f='${Version}\n' snapd
systemctl status systemd-tmpfiles-clean.timer --no-pager
```

La première relève la révision du paquet. La seconde renseigne l’état du timer, à rapprocher des règles de nettoyage effectives et de l’état des répertoires ; un timer actif ne démontre pas l’exploitabilité.

## Corriger selon la distribution et valider

À la date de cette révision, Ubuntu indique ces paquets snapd corrigés :

| Version Ubuntu | Paquet corrigé |
| --- | --- |
| 24.04 LTS | `2.73+ubuntu24.04.2` |
| 22.04 LTS | `2.73+ubuntu22.04.1` |

Pour Ubuntu 20.04 LTS avec Ubuntu Pro, le paquet corrigé indiqué est `2.67.1+20.04ubuntu1~esm1`. Consulter l’avis pour les autres versions et mises à jour ultérieures. La recommandation générale `2.63.2+` était insuffisante. Vérifier le paquet réellement installé et redémarrer les services concernés si nécessaire.

Mettre Nginx UI à une version maintenue contenant le contrôle d’authentification et renouveler les secrets exposés. Vérifier qu’une requête anonyme n’obtient ni archive ni clé et qu’une sauvegarde autorisée fonctionne. Corriger ne révoque pas les secrets déjà téléchargés.

Surveiller les téléchargements de sauvegardes hors du workflow approuvé et les créations SUID inhabituelles dans les répertoires snap. Conserver le timing et l’origine des processus : une invocation de snap-confine ne prouve pas une course réussie.
