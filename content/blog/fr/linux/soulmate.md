---
id: "HTB-2026-SOULMATE"
title: "Soulmate"
excerpt: "Soulmate part d’une application de transfert, passe par un shell web et un compte SSH ordinaire, puis atteint un service Erlang exécuté par root. La compétence centrale consiste à vérifier l’identité à chaque étape."
date: "2025-09-06"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "CONFIG-LEAK", "ERLANG", "PORT-TUNNELING"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Parcours et prérequis

La chaîne est **découverte d’un hôte virtuel → contrôle d’un compte CrushFTP → PHP sous `www-data` → mot de passe de `ben` → SSH → service Erlang local → commandes root**. La page web publique ne montre pas toute la surface ; l’hôte virtuel de transfert est décisif. Le service Erlang écoute localement : le premier accès SSH permet de l’atteindre.

Ces étapes concernent le laboratoire Soulmate autorisé. `<LAB_IP>` désigne l’adresse de la cible et `<LAB_PASSWORD>` un secret obtenu dans le laboratoire. Les commandes qualifiées d’illustratives montrent comment vérifier une hypothèse ; elles ne constituent pas une transcription de la session de l’auteur.

## Découvrir le second hôte HTTP

Un scan TCP présente SSH et HTTP. La navigation sur `soulmate.htb` montre le site public, tandis que l’énumération des hôtes virtuels révèle `ftp.soulmate.htb`, qui sert CrushFTP. Les deux noms peuvent pointer vers la même adresse IP et sélectionner des applications différentes grâce à l’en-tête `Host`. Si le navigateur ne résout pas `ftp.soulmate.htb`, ajouter ce nom et l’adresse du laboratoire au fichier hosts du poste de travail. Une page générique affichée avec l’adresse IP seule n’écarte pas l’existence du service de transfert.

La version et l’interface CrushFTP orientent la recherche. CVE-2025-31161 touche l’authentification de versions vulnérables : une requête construite spécialement permet d’obtenir un accès administratif, puis de créer ou modifier un utilisateur. Vérifier la version réellement déployée et ses correctifs avant d’utiliser un outil public. Les [informations de sécurité de l’éditeur](https://www.crushftp.com/crush11wiki/Wiki.jsp?page=Security) servent à contrôler les versions corrigées. Une [preuve de concept publique pour CVE-2025-31161](https://github.com/0xgh057r3c0n/CVE-2025-31161) décrit cette création de compte ; examiner ses requêtes et paramètres avant de l’utiliser dans le laboratoire. Le résultat à démontrer est qu’un compte contrôlé peut se connecter à CrushFTP ; un simple statut HTTP favorable ne suffit pas.

Depuis une copie locale de l’outil examinée sur le poste de test, l’appel documenté prend cette forme :

```bash
python3 CVE-2025-31161.py \
  --target_host ftp.soulmate.htb --port 80 \
  --new_user <NEW_USER> --password <NEW_PASSWORD>
```

`<NEW_USER>` et `<NEW_PASSWORD>` sont des valeurs nouvelles réservées au laboratoire ; éviter d’inscrire un vrai mot de passe réutilisé dans l’historique du shell. `--target_host` vise l’hôte virtuel CrushFTP et `--port 80` son service HTTP, pas le SSH Unix. La preuve attendue est une connexion CrushFTP interactive avec ces valeurs et un mappage de fichiers visible. Un message de création dans la console peut être trompeur si le serveur est corrigé. Si la connexion échoue, examiner la réponse HTTP de l’outil, le nom de l’administrateur visé et le niveau de correctif avant de tenter un téléversement. Cette vérification transforme une annonce d’exploitation en droit applicatif contrôlable séparément.

Ce compte doit pouvoir écrire dans un répertoire que le serveur web distinct interprète comme PHP. Examiner le système de fichiers virtuel et tester d’abord un petit fichier texte. Le chemin de destination et l’URL publique sont différents : le premier situe les octets sur le serveur, la seconde demande au serveur web de traiter le fichier. Une écriture PHP ne devient une exécution que si le chemin est servi avec l’interpréteur approprié. Dans le laboratoire, cette jonction permet d’exécuter du code comme `www-data`. Vérifier l’identité avec une sonde temporaire, puis retirer le fichier. Si le navigateur affiche le PHP brut ou renvoie 404, vérifier le mappage et les permissions avant de changer le code.

## Retrouver le secret de transition

Le shell `www-data` peut consulter les processus et les fichiers lisibles. Cet inventaire en lecture seule aide à distinguer ce qui est observé de ce qui est supposé :

```bash
id
ss -ltn
ps -eo user,pid,args | grep -E 'erl|ssh_runner' | grep -v grep
ls -l /usr/local/lib/erlang_login/start.escript
```

La liste des processus révèle un lanceur Erlang root ; le port `127.0.0.1:2222` apparaît parmi les services en écoute. Le script est un chemin local, pas une URL HTTP. Sa lecture dépend donc des droits du shell courant. Sa configuration contient un secret pour `ben`, retiré de cet article. Un mot de passe défini dans un démon n’appartient pas nécessairement à un compte Unix : tester séparément le service qui l’accepte. Sur cette machine, il est aussi réutilisé pour une connexion SSH ordinaire. `id` dans cette session confirme l’identité OS obtenue.

Un service lié à loopback reste accessible aux utilisateurs locaux. Il peut aussi être atteint à travers un tunnel authentifié. Le tunnel ne contourne pas l’authentification propre au service Erlang.

## Vérifier la frontière Erlang privilégiée

Depuis le poste de travail, avec le mot de passe SSH de `ben`, cette redirection illustrative rend le port local de la cible accessible sur le poste :

```bash
ssh -N -L 127.0.0.1:9999:127.0.0.1:2222 ben@soulmate.htb
```

Laisser cette session ouverte et lancer `ssh -p 9999 ben@127.0.0.1` dans un autre terminal. Le premier `127.0.0.1` désigne l’écouteur du poste de travail ; celui après le dernier deux-points désigne la destination vue depuis Soulmate. Si 9999 est occupé, choisir un autre port local. Si la seconde authentification échoue, contrôler l’utilisateur Erlang configuré et son mot de passe indépendamment de la connexion SSH externe.

Le shell Erlang du laboratoire autorise `os:cmd/1`, qui lance une commande système. Une preuve minimale de l’identité est :

```erlang
os:cmd("id").
```

Une expression Erlang se termine par un point. Ici, la commande revient avec l’identité root, puisque le démon SSH Erlang s’exécute sous ce compte. Utiliser le nom `ben` pour s’authentifier au service n’impose pas l’identité Unix `ben` au processus enfant : cela dépend du lancement et de la configuration du démon. La [documentation SSH d’Erlang](https://www.erlang.org/doc/apps/ssh/ssh.html) explique ses mécanismes d’authentification et de shell. Ce résultat root est propre à la configuration de Soulmate.

D’autres récits abordent CVE-2025-32433, une vulnérabilité distincte de certains serveurs SSH Erlang permettant un chemin avant authentification. Le parcours présenté ici repose sur un mot de passe et sur le shell configuré. Une connexion authentifiée réussie ne prouve pas la présence de cette CVE.

Une poignée de main SSH réussie vers le port redirigé prouve que le démon Erlang est joignable, pas que l’authentification a réussi. Son invite peut ressembler à un shell ordinaire, mais elle interprète des expressions Erlang plutôt que des commandes Bash. Tester d’abord une expression bénigne ; la grammaire du shell Erlang exige un point final. Employer ensuite `os:cmd("id").` pour observer l’identité du processus enfant. Si elle est root, l’attribuer au contexte du démon et à son shell, non au nom fourni pour l’authentification SSH. Cette distinction fonde l’élévation et sa correction : changer seulement le mot de passe Unix ne sécurise pas un shell de gestion lancé par root.

## Distinguer les identités à chaque étape

| Frontière | Contrôle | Ce que le résultat établit |
| --- | --- | --- |
| Routage HTTP | Demander `soulmate.htb` et `ftp.soulmate.htb` avec le bon en-tête `Host`. | La page CrushFTP sur le second nom prouve l’existence d’une surface distincte, même si l’IP est commune. |
| Compte CrushFTP | Ouvrir une session avec le compte créé et examiner son système de fichiers virtuel. | Le contournement a donné un droit applicatif réel et le mappage révèle où arrivent les fichiers. |
| Exécution web | Lire par son URL un diagnostic PHP temporaire indiquant l’identité. | La sortie de `id` établit l’identité OS du serveur web ; la réponse au téléversement ne prouve qu’une écriture. |
| Compte Unix | Ouvrir une nouvelle session SSH comme `ben`, puis lancer `id`. | Le secret lu dans la configuration est aussi accepté par le SSH Unix, service et permission distincts. |
| Shell Erlang | Passer par la redirection et lancer `os:cmd("id").`. | Le démon local exécute sous son propre jeton root ; la session `ben` extérieure ne fournit que l’accès réseau. |

Conserver pour chaque étape l’hôte, le port, l’identité et l’heure. Un rappel différé ou une session de navigateur encore ouverte peut faire attribuer un résultat au mauvais compte. Une nouvelle authentification suivie d’un contrôle d’identité rend la conclusion plus solide. Si le port Erlang est accessible mais rejette la connexion, la redirection fonctionne : examiner le secret du service plutôt que modifier la commande SSH.

## Diagnostic et correction

Si le site public semble être le seul service, refaire l’énumération des hôtes virtuels. Si la création du compte fonctionne mais que le PHP déposé ne s’exécute pas, vérifier le système de fichiers virtuel, le droit d’écriture, l’URL et le traitement PHP. Si le mot de passe de `ben` fonctionne sur un service SSH mais échoue sur l’autre, comparer leurs bases d’utilisateurs distinctes. Si `os:cmd("id")` donne un compte non privilégié, regarder le processus et l’unité du service : la bannière Erlang ne détermine pas les droits OS.

Mettre CrushFTP à une version corrigée par l’éditeur et surveiller les créations et changements de mot de passe des utilisateurs de transfert. Placer les fichiers transférés hors des chemins exécutables par le serveur web. Sortir les secrets des scripts lisibles, séparer les identifiants Unix et de gestion et renouveler les valeurs divulguées. Exécuter le shell Erlang sous un compte dédié non privilégié et restreindre ses commandes. Après correction, les transferts autorisés doivent rester possibles, un PHP déposé doit rester inerte, les identifiants SSH ordinaires doivent être refusés par le service de gestion et celui-ci doit opérer avec son identité dédiée.
