---
id: "HTB-2026-INTERPRETER"
title: "Interpreter"
excerpt: "Interpreter enchaîne une API Mirth Connect vulnérable, un enregistrement de mot de passe en base et une seconde évaluation des données patient dans un service Python exécuté par root."
date: "2026-02-21"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "DESERIALIZATION", "CVE-2023-43208", "F-STRING-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Distinguer les trois identités

La progression est **Mirth Connect 4.4.0 → désérialisation Java sans authentification → shell `mirth` → secret de base de données → hash de `sedric` → SSH comme `sedric` → API locale de notification → f-string évaluée comme root**. Shell applicatif, connexion SQL, compte SSH et service root possèdent des droits différents. À chaque transition, il faut demander quelle observation confirme la nouvelle identité.

Les exemples utilisent `interpreter.htb` comme hôte du laboratoire. Mots de passe, hashes, payloads de shell et flags sont retirés. Les extraits de code sont réduits au mécanisme. Les commandes sont des diagnostics illustratifs pour un rejeu autorisé.

## Identifier Mirth Connect et y entrer

Les premiers ports montrent notamment le site web et SSH ; un service de messages médicaux peut aussi apparaître. Le téléchargement de l’administrateur Mirth expose un `webstart.jnlp` dont les bibliothèques référencées indiquent la version de Connect. Cette version oriente l’enquête, mais doit être comparée à l’installation et aux correctifs réels. Le laboratoire présente Mirth Connect 4.4.0. CVE-2023-43208 concerne une désérialisation accessible sans authentification dans l’API avant la correction 4.4.1. Les [notes de version de l’éditeur](https://github.com/nextgenhealthcare/connect/wiki/4.4.1---What's-New) décrivent le correctif et la [recherche initiale](https://docs.horizon3ai.com/knowledge_base/weaknesses/H3-2023-0027/) explique le chemin de l’entrée.

Le serveur vulnérable transforme du XML non fiable en objets Java avec XStream. Si le graphe d’objets autorisé provoque des actions pendant sa reconstruction, l’analyse de la requête peut exécuter du code avant authentification. La frontière est celle de l’entrée transformée en objets actifs, pas un mot de passe contourné. Utiliser un outil examiné correspondant au build exact et relever la route, la réponse et l’identité du processus. Le laboratoire rapporte une exécution comme `mirth`. Un code HTTP favorable ne démontre pas l’exécution ; un `id` contrôlé dans le processus obtenu le fait.

En cas d’échec, vérifier version déployée, route, type de contenu exact, réécriture par un proxy et éventuel correctif rétroporté. Une bannière de version seule n’établit pas que la désérialisation reste accessible.

## Des droits applicatifs à la base de données

Dans le laboratoire, le shell `mirth` peut lire `/usr/local/mirthconnect/conf/mirth.properties`, qui contient les paramètres de connexion SQL. Le mot de passe de la base donne accès sous l’utilisateur SQL configuré ; il ne confère pas le compte Linux `sedric`. Vérifier hôte, base, utilisateur et authentification avant les requêtes. Les tables importantes sont `PERSON` et `PERSON_PASSWORD` : la première relie l’ID au nom `sedric`, la seconde contient le hash associé. Exemple de lecture :

```sql
SELECT p.ID, p.USERNAME, pp.PASSWORD
FROM PERSON AS p
JOIN PERSON_PASSWORD AS pp ON pp.PERSON_ID = p.ID
WHERE p.USERNAME = 'sedric';
```

Ne pas publier la valeur retournée. Le champ stocke en Base64 un sel suivi d’une clé dérivée, et non un mot de passe en clair. Dans le build examiné, le code Mirth utilise PBKDF2-HMAC-SHA256 avec huit octets de sel et 600 000 itérations. Ces paramètres viennent de l’implémentation : il faut les confirmer dans le JAR installé avant toute conversion hors ligne. Décoder Base64, séparer les huit premiers octets, conserver les octets de la clé dérivée, puis encoder chaque partie au format de l’outil choisi. Une mauvaise découpe peut faire échouer la recherche d’un mot de passe correct. Tester le candidat sur SSH, puis `id`, établit seulement alors la transition vers `sedric`.

La base contient aussi les définitions de canaux Mirth. Elles expliquent comment les messages médicaux atteignent un service interne de notification, mais la configuration du canal et le secret de `sedric` sont deux découvertes différentes. Une description de canal ne donne pas un shell root.

## Trouver le service root et tester son entrée

Depuis la session SSH `sedric`, examiner les sockets en écoute et l’unité du service. Un processus Python écoute sur `127.0.0.1:54321`, tourne comme root et accepte `POST /addPatient`. Son script `/usr/local/bin/notif.py` est lisible dans le contexte de groupe de `sedric`, mais pas par `mirth`. Le gestionnaire reçoit un XML avec un élément `patient` et des champs tels que `firstname`, `lastname`, `birth_date`, `sender_app`, `timestamp` et `gender`. Il contrôle aussi l’adresse source : un appel direct depuis le poste peut recevoir 403 alors qu’un appel local marche. Utiliser `curl` sur l’hôte ou un tunnel SSH depuis la session authentifiée. Un GET donnant 405 confirme la présence de la route, sans tester le traitement.

Le cœur du défaut est :

```python
template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old"
return eval(f"f'''{template}'''")
```

La première f-string insère les champs comme données. Ensuite, `eval` construit et analyse une **nouvelle** f-string à partir du texte assemblé. Les accolades contenues dans un nom deviennent des expressions lors de ce second passage. L’expression régulière d’entrée permet ces accolades et d’autres caractères nécessaires à une expression, malgré le rejet de certains métacaractères du shell. La frontière est l’évaluation Python, pas l’analyse d’une commande shell classique. La [documentation Python sur eval](https://docs.python.org/3/library/functions.html#eval) déconseille les chaînes non fiables.

Une sonde inoffensive envoie `{2+3}` comme prénom avec un XML et une date de naissance valides. Une réponse contenant `5` à la place des accolades démontre l’évaluation. Si le service rend `[INVALID_INPUT]` ou `[INVALID_DOB]`, corriger les champs avant de conclure sur le puits. Une erreur d’évaluation appelle à contrôler guillemets et expression. Le service étant root, une autre expression pourrait produire des effets privilégiés ; le calcul bénin établit déjà la frontière défaillante sans reproduire de payload de shell.

## Corriger et vérifier

Mettre Mirth Connect à une version maintenue corrigée, restreindre l’accès à la configuration et aux enregistrements SQL et renouveler les secrets exposés. Traiter la réutilisation du mot de passe comme une faiblesse distincte : mots de passe forts et indépendants, hashes avec des paramètres actuels. Faire tourner le service de notification sous un compte non privilégié et autoriser ses appelants même s’il écoute sur loopback.

Supprimer entièrement la seconde évaluation. Analyser et valider l’année de naissance, calculer l’âge comme nombre et interpoler chaque champ **une seule fois** dans une chaîne ordinaire. Au test, `{2+3}` doit rester littéral ou être refusé, jamais devenir `5`. Vérifier aussi les notifications normales, le refus des appelants distants et l’identité OS réelle du service après redémarrage. Surveiller les processus enfants inattendus de Mirth et du service de notification en les reliant aux requêtes.
