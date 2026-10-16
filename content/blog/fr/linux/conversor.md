---
id: "HTB-2026-CONVERSOR"
title: "Conversor"
excerpt: "Conversor transforme une feuille XSLT fournie par l’utilisateur en écriture de fichier, puis en exécution planifiée ; un choix de configuration sudo permet ensuite de devenir root."
date: "2025-10-25"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "XSLT-INJECTION", "CRON-HIJACK", "NEEDRESTART"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Comprendre la chaîne

Conversor propose de convertir un document XML avec une feuille XSLT envoyée par l’utilisateur. Après inscription, un compte peut transmettre les deux fichiers au serveur. Une feuille XSLT est un programme interprété côté serveur : la question de sécurité est donc de savoir quelles lectures et écritures le moteur autorise.

La progression du laboratoire est **compte web → écriture par XSLT → script Python exécuté comme `www-data` → hash local → SSH comme `fismathack` → exécution root via `needrestart`**. Chaque identité possède des droits distincts. Un fichier placé dans un répertoire ne s’exécute pas tout seul ; une tâche planifiée doit le charger. Le compte web et le shell applicatif ne donnent pas automatiquement accès à SSH.

Les commandes concernent uniquement la machine autorisée. `conversor.htb` représente le nom de la cible ; les chemins locaux des exemples désignent le poste de travail sauf indication contraire. Le mot de passe et l’adresse de rappel sont omis.

## Repérer la frontière de transformation

Une reconnaissance TCP montre SSH et HTTP. Le service web redirige vers `conversor.htb` : il faut résoudre ce nom vers l’adresse du laboratoire avant d’ouvrir le site. Le nom compte, car l’hôte virtuel peut répondre différemment de l’adresse IP nue. Le site permet de s’inscrire et de télécharger une feuille XSLT d’exemple. Commencer avec un XML ordinaire et cette feuille fournit un témoin positif : on découvre les champs du formulaire, le cookie de session et le résultat normal.

La page About fournit `source_code.tar.gz`. Lire le gestionnaire `/convert` apporte davantage que chercher un exploit à partir de la bannière Apache. Le code sauvegarde les deux fichiers, analyse le XML avec les entités et le réseau désactivés, puis analyse la feuille et construit un objet `etree.XSLT`. Il s’agit de deux traitements et de deux ensembles de permissions. La protection contre les entités XML ne limite pas nécessairement les extensions utilisées par la feuille. La [documentation XSLT de lxml](https://lxml.de/xpathxslt.html) et son [contrôle des accès](https://lxml.de/api/lxml.etree.XSLTAccessControl-class.html) décrivent cette distinction.

Les notes de déploiement de l’archive indiquent qu’une tâche exécute les fichiers Python de `/var/www/conversor.htb/scripts/` sous `www-data`. Voilà une destination précise pour tester une écriture. Il faut lire la colonne utilisateur de la tâche : un fichier `/etc/crontab` appartenant à root peut lancer ses commandes sous un autre compte.

## Vérifier l’écriture, puis l’exécution

Une feuille XSLT peut utiliser `exsl:document` afin de créer un second fichier. Dans ce laboratoire, aucune restriction efficace n’empêche la feuille fournie par l’utilisateur d’écrire dans le répertoire des scripts. Ce diagnostic minimal crée un marqueur sans ouvrir de connexion distante :

```xml
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:exsl="http://exslt.org/common"
  extension-element-prefixes="exsl">
  <xsl:template match="/">
    <exsl:document href="/var/www/conversor.htb/scripts/probe.py" method="text">
      <xsl:text>from pathlib import Path&#10;Path('/tmp/conversor-probe').write_text('executed')&#10;</xsl:text>
    </exsl:document>
    <ok>converted</ok>
  </xsl:template>
</xsl:stylesheet>
```

Cet exemple est **illustratif**, pas la copie d’une requête capturée. Envoyer la feuille avec un XML simple depuis une session authentifiée. Un message de conversion réussie confirme seulement la transformation. La présence de `probe.py`, puis du fichier `/tmp/conversor-probe` après l’intervalle planifié, établit deux observations différentes : écriture puis exécution. Pour confirmer l’identité, une sonde dans le laboratoire peut enregistrer l’UID effectif ; la configuration de la tâche indique `www-data`.

Si le fichier n’apparaît pas, vérifier l’espace de noms XSLT, l’activation de l’extension, le chemin résolu et les droits du processus web. S’il apparaît mais ne s’exécute pas, vérifier le motif de nom de fichier, la syntaxe Python et l’état du planificateur. Une erreur de lecture avec `document()` ne prouve pas que l’écriture par `exsl:document` soit interdite : la première fonction lit une entrée, la seconde crée une sortie.

Le chemin publié exploite cette écriture pour déposer un script donnant un shell applicatif. Une connexion de rappel exige un écouteur, une adresse atteignable depuis la cible et l’attente de l’exécution planifiée. Un marqueur inoffensif permet de comprendre les deux frontières sans mêler les problèmes de réseau et de quoting.

## Passer de `www-data` à `fismathack`

La configuration de l’application désigne `/var/www/conversor.htb/instance/users.db`, une base SQLite. L’archive téléchargeable peut contenir une base de développement vide : c’est le fichier vivant qu’il faut examiner depuis le contexte applicatif. Une fois l’exécution `www-data` obtenue, regarder le schéma SQLite et l’enregistrement du compte concerné. Conserver le format du hash et l’identité associée, sans publier le secret. Un hash n’est pas un mot de passe utilisable tel quel.

Le laboratoire utilise un hash de mot de passe fondé sur MD5 pour `fismathack`. Une attaque hors ligne peut retrouver un mot de passe faible malgré ce hachage. Il reste ensuite à vérifier séparément que SSH accepte le candidat. Dans la nouvelle session, `id` matérialise le changement d’identité. La lecture de la base ne modifie aucun droit, et un hash trouvé dans une archive publique ne prouve pas qu’il représente l’état de la base active.

## Comprendre l’élévation par `needrestart`

Dans la session `fismathack`, `sudo -l` indique que `/usr/sbin/needrestart` peut s’exécuter sans mot de passe. Son option `-c` sélectionne un fichier de configuration, interprété comme du Perl. La règle permet au compte de choisir un fichier qu’il contrôle et de le faire lire par un processus privilégié. Le défaut porte sur la confiance accordée au chemin de configuration. Le [manuel de needrestart](https://manpages.debian.org/bookworm/needrestart/needrestart.1.en.html) documente `-c`.

Pour un test contrôlé, créer un fichier Perl qui affiche uniquement l’identité effective, puis lancer exactement le binaire autorisé par sudo :

```bash
printf '%s\n' 'print "effective UID: $>\n";' > /home/fismathack/probe.conf
sudo /usr/sbin/needrestart -c /home/fismathack/probe.conf
```

Les apostrophes du shell écrivent `$>` littéralement ; Perl l’évalue lorsqu’il charge la configuration. Une valeur 0 démontre une exécution avec les droits root. Cette sonde est illustrative ; elle suffit à établir la frontière franchie. En cas d’échec, vérifier la règle sudo exacte, les restrictions d’arguments et la version du programme avant de conclure.

## Corriger et retester

Configurer `XSLTAccessControl` pour refuser les accès aux fichiers et au réseau, ou isoler les conversions dans un service sans accès aux chemins sensibles. Placer les téléversements hors des répertoires exécutables et contrôler les noms de fichiers avant de composer un chemin. Réserver l’écriture du dossier de scripts aux administrateurs du déploiement ; remplacer l’exécution de tous les fichiers correspondants par un programme fixe et revu. Le retest doit accepter une conversion légitime tout en rejetant l’écriture d’un fichier secondaire.

Protéger la base applicative, employer un hachage moderne et renouveler les mots de passe exposés ou réutilisés entre le site et SSH. Supprimer la délégation sudo trop large, ou imposer une configuration `needrestart` détenue par les administrateurs. Après correction, une configuration contrôlée par `fismathack` doit être refusée tandis que la maintenance approuvée reste possible. Ces refus à chaque frontière constituent une meilleure preuve qu’une simple bannière de version.
