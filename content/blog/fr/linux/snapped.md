---
id: "HTB-2026-SNAPPED"
title: "Snapped"
excerpt: "Snapped expose une sauvegarde Nginx UI accompagnée des éléments permettant de la déchiffrer, puis utilise une course locale dans snapd après l’accès SSH."
date: "2026-03-23"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "BACKUP-DISCLOSURE", "NGINX-UI", "CVE-2026-3888"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Deux faiblesses indépendantes

La chaîne est **découverte d’un hôte virtuel → `/api/backup` sans authentification → fichiers chiffrés et clé/IV → hash dans la base → SSH comme `jonathan` → interaction snapd et `systemd-tmpfiles` → root**. Le défaut de sauvegarde franchit l’authentification web. Celui de snapd franchit une frontière locale de propriété de fichiers. Les versions de l’application et du paquet orientent les recherches, mais ne prouvent pas seules une exploitation.

`snapped.htb` et `admin.snapped.htb` sont des noms du laboratoire. Conserver les archives et secrets extraits dans un dossier de travail temporaire, puis les retirer après les tests. Les commandes concernent uniquement le laboratoire autorisé ; aucun mot de passe, clé, hash ou payload n’est recopié.

## Trouver l’hôte d’administration

Un scan TCP montre SSH et HTTP. Le site principal est essentiellement statique. L’énumération des hôtes virtuels révèle `admin.snapped.htb`, qui héberge Nginx UI. Résoudre ce nom vers l’adresse de la machine avant les tests ; une requête adressée à l’IP nue peut sélectionner un autre hôte virtuel. Identifier l’application par son interface et ses propres fichiers plutôt que par la bannière du serveur nginx frontal. Le laboratoire présente Nginx UI 2.3.2.

CVE-2026-27944 concerne un endpoint de sauvegarde sans contrôle d’accès dans des installations Nginx UI touchées. L’[avis du projet](https://github.com/0xJacky/nginx-ui/security/advisories/GHSA-g9w5-qffc-6762) décrit l’absence d’authentification et la divulgation de clé. Tester sans cookie de session et conserver le corps et les en-têtes de **la même réponse** :

```bash
curl -sS -D backup.headers -o backup.zip 'http://admin.snapped.htb/api/backup'
file backup.zip
unzip -l backup.zip
```

La première commande évite d’afficher le ZIP binaire dans le terminal. L’en-tête `X-Backup-Security` contient deux chaînes Base64 séparées par deux-points : une clé AES et un vecteur d’initialisation. Dans le laboratoire, elles produisent respectivement 32 et 16 octets, adaptés à AES-256-CBC. Les valeurs peuvent changer à chaque téléchargement : l’en-tête d’une ancienne réponse peut échouer sur une nouvelle archive. Un HTTP 200 sans le ZIP et l’en-tête correspondant ne démontre pas toute la fuite.

Le corps téléchargé est une **archive ZIP externe**. Elle contient `hash_info.txt`, `nginx-ui.zip` et `nginx.zip` ; ces membres sont chiffrés malgré leur nom. Extraire d’abord l’archive externe. Décoder les deux chaînes Base64 en octets, les convertir en hexadécimal pour `-K` et `-iv` d’OpenSSL et déchiffrer un membre avec `openssl enc -aes-256-cbc -d`. Vérifier le type du fichier obtenu avant d’essayer de le décompresser. Déchiffrer directement le ZIP externe revient à travailler sur la mauvaise couche. Si OpenSSL signale un remplissage invalide, vérifier d’abord que la clé et l’IV viennent de la même réponse et que le fichier en entrée est bien un membre chiffré.

L’archive Nginx UI déchiffrée contient `database.db`, une base SQLite. Examiner son schéma et les lignes `users` utiles. Dans le laboratoire, l’enregistrement de `jonathan` utilise bcrypt. Identifier le préfixe et choisir le mode hors ligne adéquat plutôt que faire confiance à la détection automatique. Bcrypt ralentit les essais sans rendre un mot de passe faible impossible à trouver. Tester le candidat sur SSH et lancer `id` dans la session. Le hash présent dans la sauvegarde est une divulgation ; la connexion SSH réussie représente une autre faiblesse de choix ou de réutilisation du secret.

## Vérifier les prérequis de snapd

Depuis la session `jonathan`, inventorier paquet, binaire privilégié et nettoyage :

```bash
dpkg-query -W -f='${Version}\n' snapd
ls -l /usr/lib/snapd/snap-confine
systemctl list-timers systemd-tmpfiles-clean --all
cat /usr/lib/tmpfiles.d/tmp.conf
```

Le laboratoire utilise un `snap-confine` SUID provenant de snapd 2.63.1+24.04. La règle de nettoyage de `/tmp` a un délai court, et le timer se déclenche fréquemment. Une autre configuration peut surcharger la règle du fournisseur : contrôler la configuration effective. CVE-2026-3888 exploite une course : `systemd-tmpfiles` peut supprimer un répertoire temporaire privé de snap, tandis que `snap-confine` le recrée et lui fait confiance pendant la construction d’un espace de montage. Un utilisateur local capable de placer des données au bon moment peut influencer une opération privilégiée. L’[avis Ubuntu](https://ubuntu.com/security/CVE-2026-3888) donne les branches affectées et leurs correctifs.

Cette voie dépend du timing. Ni la bannière du paquet ni un timer actif ne suffisent. Vérifier la distribution, la révision installée, la forme SUID ou capabilities du programme, la règle effective de `/tmp` et l’emploi du chemin vulnérable. Un outil de démonstration doit correspondre à cet environnement. Relever les prérequis et l’UID effectif obtenu ; un fichier créé sous root après la course vaut mieux qu’un message de réussite de script. Pour valider un correctif, préférer l’état du paquet éditeur et un test contrôlé sur un instantané jetable à une répétition de payload invasif.

## Diagnostic et correction

Si `/api/backup` redirige vers une connexion, vérifier l’hôte virtuel, l’URL, les cookies et le middleware. Si l’extraction réussit mais pas le déchiffrement, revoir la superposition ZIP/chiffrement et l’association clé/IV. Si le candidat est refusé par SSH, contrôler type de hash, compte et fraîcheur du secret. Si l’outil snapd échoue par intermittence, distinguer échec normal d’une course, paquet corrigé et prérequis de nettoyage absent ; la seule installation de snapd ne suffit pas.

Mettre Nginx UI à une version maintenue corrigée et imposer l’authentification pour les sauvegardes. Ne jamais envoyer la clé dans la même réponse non authentifiée que les données chiffrées. Renouveler les secrets provenant de téléchargements passés. Mettre snapd à jour par les paquets de sécurité de la distribution, confirmer la révision corrigée pour cette version et redémarrer les composants recommandés. Au retest, l’accès non authentifié à la sauvegarde doit échouer tandis que sauvegarde et restauration autorisées restent possibles, l’ancien secret SSH doit être refusé et le paquet snapd doit être corrigé. Surveiller les téléchargements anormaux et les créations de fichiers privilégiés liées aux espaces de noms snap en conservant le contexte des requêtes et processus.
