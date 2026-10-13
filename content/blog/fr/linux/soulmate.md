---
id: "HTB-2026-SOULMATE"
title: "Soulmate"
excerpt: "Réutilisation d’identifiants Erlang et shell SSH local privilégié : comprendre l’élévation décrite et les limites de la preuve d’accès initial."
date: "2025-09-06"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "CONFIG-LEAK", "ERLANG", "PORT-TUNNELING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Ce que le récit permet d’établir

Soulmate illustre le risque d’un shell d’administration local partageant les identifiants d’un compte ordinaire. Le récit existant rapporte un accès SSH comme `ben`, puis une exécution root via un service SSH Erlang sur le port loopback 2222.

La découverte initiale des identifiants reste incomplète. Le texte cite /usr/local/lib/erlang_login/start.escript, un chemin système, sans URL HTTP, réponse ou primitive de lecture démontrant son accès par un visiteur non authentifié. Cette version commence donc avec des identifiants `ben` valides. Elle ne présente pas l’énumération web comme un accès initial démontré.

## Prérequis et énumération

La cible est `soulmate.htb`. Reproduire la partie étayée nécessite un accès SSH fonctionnel comme `ben`, un accès au service local et des identifiants acceptés par ce service. Un port TCP joignable ne suffit pas.

Depuis la session déjà obtenue, cette commande liste les sockets TCP en écoute sans modifier leur configuration :

```bash
ss -ltn
```

Le récit rapporte `127.0.0.1:2222` et une bannière SSH Erlang. La bannière suggère une implémentation ; elle ne détermine ni le compte système du service ni sa vulnérabilité. La rapprocher de sa configuration et de l’identité du processus si les droits le permettent.

La configuration décrite comporte une entrée de cette forme ; le mot de passe est volontairement remplacé :

```erlang
{user_passwords, [{"ben", "<LAB_PASSWORD>"}]},
```

`<LAB_PASSWORD>` désigne l’identifiant obtenu dans le lab autorisé. La [documentation SSH Erlang](https://www.erlang.org/doc/apps/ssh/ssh.html) décrit l’authentification du démon et la configuration du shell. Un shell applicatif peut conserver l’identité système du démon même si le nom SSH ressemble à un compte système ordinaire.

## Joindre le service et vérifier l’identité

Depuis le poste de travail, ouvrir ce tunnel illustratif avec le compte `ben` déjà disponible :

```bash
ssh -N -L 127.0.0.1:9999:127.0.0.1:2222 ben@soulmate.htb
```

Le port 9999 du poste est redirigé vers le port 2222 du loopback distant. Laisser ce processus actif et utiliser un second terminal :

```bash
ssh -p 9999 ben@127.0.0.1
```

Le service réalise toujours sa propre authentification. Le tunnel apporte la connectivité, pas un contournement d’authentification.

Dans le shell Erlang, la vérification d’identité conservée est :

```erlang
os:cmd("id").
```

Le récit rapporte une identité root à cette étape. Cela étaye une exécution sous un démon lancé comme root. Cela ne signifie pas que toute installation SSH Erlang est vulnérable et ne démontre pas l’exposition initiale des identifiants.

## Remédiation et vérification

Exécuter les shells d’administration sous un compte dédié non privilégié et supprimer l’accès interactif aux commandes système s’il est inutile. Employer des identifiants distincts ; renouveler les secrets présents dans les scripts ou réutilisés entre services. Limiter l’authentification et les redirections de ports en conservant les usages administratifs nécessaires.

Vérifier séparément les deux frontières : un compte ordinaire ne doit pas s’authentifier au shell de gestion et un compte de gestion autorisé ne doit pas obtenir une exécution root. Contrôler l’identité après redémarrage, pas uniquement la configuration attendue du service.

Surveiller les authentifications inhabituelles au démon local et les processus enfants qu’il lance. L’écoute loopback réduit l’exposition distante sans protéger contre un utilisateur local ou un tunnel authentifié. La preuve manquante concerne l’acquisition des identifiants, pas l’effet du shell privilégié.
