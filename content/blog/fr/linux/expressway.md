---
id: "HTB-2025-002"
title: "Expressway"
excerpt: "IKE Aggressive Mode permet des essais hors ligne ; la réutilisation du secret mène à SSH puis à un binaire sudo vulnérable indépendant."
date: "2025-09-20"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "VPN", "IPSEC", "IKE", "PRIVESC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
---

## Chaîne et preuves

Le récit d’Expressway rapporte un échange IKE Aggressive Mode, la récupération d’une clé prépartagée (PSK), sa réutilisation comme mot de passe SSH d’`ike` et une élévation locale via CVE-2025-32463. Il montre trois problèmes distincts : exposition du protocole, secret devinable et réutilisation d’identifiants.

Le transcript ne conserve ni handshake complet ni commande de récupération. Le secret retrouvé et le flag sont retirés ; les explications suivantes ne remplacent pas les captures manquantes.

## Suivre la surface UDP

Le nom rapporté est `expressway.htb` ; le récit liste UDP 500, 4500 et 69. Comme le décrit le [guide UDP de Nmap](https://nmap.org/book/scan-methods-udp-scan.html), un scan UDP peut produire des états ambigus : `open|filtered` nécessite une réponse de protocole avant d’identifier un service. La présence de TFTP ne prouve pas une fuite de configuration.

Pour un diagnostic autorisé, cette commande illustrative limite la découverte aux ports rapportés :

```bash
sudo nmap -sU -sV -p 500,4500,69 expressway.htb
```

Elle demande l’identification des services UDP ; elle ne s’authentifie pas au VPN et ne retrouve aucun secret. Relever le protocole ayant répondu et les conditions du scan au lieu de prendre le silence pour une confirmation.

## Aggressive Mode et essais hors ligne

Le récit rapporte l’identité `ike@expressway.htb` et une authentification PSK. Les échanges IKEv1 Aggressive Mode permettent de capturer des valeurs contre lesquelles tester des mots de passe hors ligne. Le protocole est décrit dans la [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.html). Une identité peut orienter la découverte de comptes ; elle n’est pas un identifiant SSH.

La récupération dépend de la résistance de la PSK aux essais et d’une capture correcte. Le récit rapporte que cette PSK authentifie aussi le compte SSH `ike`. Cette réutilisation constitue une faiblesse supplémentaire : retrouver une PSK VPN ne donne pas intrinsèquement un accès SSH.

## Identifier le sudo réellement exécuté

Après l’accès SSH, le récit relève sudo 1.9.17 et un binaire SUID dans `/usr/local/bin`. Ces vérifications locales illustratives distinguent cette copie du binaire géré par les paquets :

```bash
command -v sudo
/usr/local/bin/sudo --version
ls -l /usr/local/bin/sudo
```

Elles relèvent la résolution, la version déclarée et les permissions, sans prouver l’absence d’un backport ni le succès d’un exploit.

CVE-2025-32463 implique la lecture d’une configuration NSS contrôlée lors du traitement chroot. La recherche initiale identifie les versions amont 1.9.14–1.9.17 et la correction 1.9.17p1. Aucune règle sudoers autorisant une commande n’est nécessaire pour ce chemin. Voir la [publication Stratascale](https://www.stratascale.com/resource/cve-2025-32463-sudo-chroot-elevation-of-privilege/).

Le récit rapporte une exécution root, mais le script copié ne sélectionne pas explicitement le binaire personnalisé. Cette version retire ce script ambigu et demande d’établir l’exécutable réellement concerné, l’architecture et l’environnement.

## Remédiation et clôture

Remplacer IKEv1 Aggressive Mode si possible, utiliser des identifiants forts et distincts, et renouveler la PSK et le mot de passe réutilisé. Vérifier l’indisponibilité de l’échange ancien et le refus des secrets précédents, tout en conservant les accès VPN et SSH approuvés.

Installer la mise à jour sudo supportée et inventorier toutes les copies privilégiées, y compris dans `/usr/local/bin`. Pour un build personnalisé, utiliser une version amont corrigée ou retirer la copie. Vérifier résolution et provenance après mise à jour ; corriger `/usr/bin/sudo` ne répare pas un autre binaire SUID.

Surveiller les négociations IKE répétées, les connexions SSH associées aux identités VPN et les exécutions privilégiées avec des chemins chroot inhabituels. Les essais hors ligne ne génèrent pas une série d’échecs de login : ces journaux ne mesurent pas la récupération d’une PSK capturée.
