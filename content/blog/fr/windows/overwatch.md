---
id: "HTB-2026-OVERWATCH"
title: "Overwatch"
excerpt: "Overwatch associe un partage de logiciels lisible, un identifiant SQL embarqué, le contrôle DNS de la destination d’un serveur lié et une injection PowerShell dans un service local de gestion."
date: "2026-02-07"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MEDIUM", "DNS-POISONING", "WCF-SERVICE", "COMMAND-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Suivre les permissions nécessaires

La chaîne est **partage `software$` lisible → identifiant dans `overwatch.exe` → MSSQL sur 6520 → serveur lié `SQL07` → enregistrement DNS Active Directory → identifiant SQL distant intercepté → WinRM comme `sqlmgmt` → méthode WCF `KillProcess` → LocalSystem**. Chaque transition exige une permission différente. Le mot de passe récupéré grâce au serveur lié correspond à une authentification SQL stockée et transportée dans TDS ; il ne s’agit pas d’un hash NTLM cassé hors ligne.

La cible appartient à `overwatch.htb`. `<LAB_IP>` et `<ATTACKER_IP>` désignent des adresses du laboratoire autorisé, et les secrets sont retirés. Les requêtes et extraits sont des diagnostics illustratifs, pas une transcription de la session de l’auteur.

## Lire le logiciel et ses connexions

La reconnaissance des ports montre SMB, WinRM et MSSQL sur le port inhabituel 6520. Tester la lecture du partage `software$` sans compte de domaine, puis télécharger l’exécutable .NET sur un poste d’analyse. Noter son empreinte et examiner son code avec un décompilateur .NET. Une chaîne de connexion de `overwatch.exe` donne un identifiant SQL. L’application contient aussi le code du service WCF utilisé plus tard. Ces découvertes expliquent l’intérêt du binaire, mais ni un mot de passe décompilé ni du code source ne prouvent que le serveur distant les acceptera.

Avec l’identifiant récupéré, se connecter à MSSQL sur 6520 et regarder le contexte et les liens :

```sql
SELECT SYSTEM_USER AS current_login, ORIGINAL_LOGIN() AS original_login;
SELECT name, data_source, is_rpc_out_enabled FROM sys.servers;
```

`SYSTEM_USER` désigne l’identité SQL courante ; `ORIGINAL_LOGIN()` identifie le compte qui a ouvert la session. Le lien `SQL07` compte parce qu’il déclenche une connexion du serveur SQL vers un nom d’hôte. L’existence du lien ne démontre ni le droit de l’appeler ni la valeur des droits du compte distant. Contrôler le mappage et l’option RPC avant toute requête liée. Microsoft décrit le [fonctionnement des serveurs liés](https://learn.microsoft.com/en-us/sql/relational-databases/linked-servers/linked-servers-database-engine).

## Pourquoi le changement DNS divulgue le secret

Dans le laboratoire, `SQL07` ne se résout pas normalement. L’identifiant SQL initial possède aussi le droit de créer un objet enfant dans la zone DNS intégrée à Active Directory. Ajouter un enregistrement A pour ce nom et le faire pointer vers un écouteur contrôlé change la destination de la prochaine connexion du serveur lié. C’est un deuxième contrôle de permissions : un identifiant SQL ne donne pas automatiquement le droit d’écrire dans DNS. Vérifier l’ACL de la zone et le nom réellement demandé par le serveur SQL. Une réponse DNS depuis le poste de travail ne prouve pas celle que le service SQL emploie.

Après le changement DNS, cette requête illustrative tente une opération distante :

```sql
EXEC ('SELECT 1') AT [SQL07];
```

Elle nécessite `RPC OUT` et un mappage utilisable. Ici, le lien recourt à une **authentification SQL stockée**. Le serveur envoie un paquet TDS `LOGIN7` à l’adresse devenue celle de `SQL07` ; dans cette configuration, le champ du mot de passe emploie un brouillage réversible, sans confidentialité du transport. Un écouteur compatible peut décoder le compte distant `sqlmgmt`. Avec l’authentification Windows intégrée, l’échange serait différent et ne livrerait pas ainsi un mot de passe en clair. Il faut regarder la capture effective et le chiffrement configuré ; un journal Responder générique n’est pas une preuve suffisante. La [spécification TDS](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-tds/) fournit le contexte du protocole.

Tester ensuite le secret `sqlmgmt` sur WinRM et exécuter `whoami /all`. La capture devient un accès à l’hôte seulement lorsque cette authentification distincte réussit. Si le lien échoue avant tout trafic, rechercher un cache DNS, une mauvaise portée de l’enregistrement, RPC OUT désactivé, un mappage incorrect ou un chiffrement exigé.

## Appeler le service WCF depuis l’hôte

Le service .NET décompilé offre `KillProcess(string processName)` sur le port 8000. Il peut écouter localement alors que le pare-feu bloque les connexions directes du poste de travail. Depuis la session WinRM, utiliser `localhost` et récupérer d’abord le WSDL afin de confirmer l’URL et le nom de méthode. Le point d’accès s’appelle `MonitorService` ; une classe interne peut s’appeler `MonitoringService`. Le contrat et le code valent mieux qu’une enveloppe SOAP devinée.

La méthode vulnérable assemble un script PowerShell avec le nom de processus fourni :

```csharp
string scriptContents = "Stop-Process -Name " + processName + " -Force";
pipeline.Commands.AddScript(scriptContents);
```

`AddScript` analyse un script complet. Un séparateur présent dans `processName` peut devenir de la syntaxe PowerShell au lieu de rester un nom. Une sonde bénigne peut demander au service d’afficher son identité et examiner le résultat SOAP. Dans le laboratoire, le service tourne comme LocalSystem : ce contrôle établit une exécution dans ce contexte. Ajouter `sqlmgmt` au groupe Administrators est un effet durable distinct ; le jeton WinRM existant n’acquiert pas immédiatement ses nouveaux groupes. Une reconnexion peut être nécessaire. Microsoft documente l’API typée [AddCommand](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.powershell.addcommand).

Une requête SOAP de diagnostic, limitée au laboratoire, rend visible le passage de la chaîne au parseur PowerShell. L’envoyer depuis la session déjà ouverte sur l’hôte vers `localhost`, après contrôle du WSDL et du compte de service :

```http
POST /MonitorService/ HTTP/1.1
Host: localhost:8000
Content-Type: text/xml; charset=utf-8
SOAPAction: "http://tempuri.org/IMonitoringService/KillProcess"

<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <KillProcess xmlns="http://tempuri.org/">
      <processName>x; whoami #</processName>
    </KillProcess>
  </s:Body>
</s:Envelope>
```

L’en-tête `SOAPAction` choisit la méthode de l’interface ; le corps XML fournit son argument texte. En PowerShell, `;` termine la commande `Stop-Process` prévue et `#` met en commentaire le `-Force` ajouté. `whoami` ne sert qu’à identifier le processus. Une réponse `KillProcessResult` portant le compte du service établit l’exécution ; un code HTTP 200 avec un corps vide ou une faute ne suffit pas. L’espace de noms `tempuri.org` et la liaison HTTP sont ceux du laboratoire : sur un autre service, il faut lire le WSDL réel. L’appel se fait depuis Windows car le pare-feu interdit l’accès direct depuis le poste de test.

Si le WSDL est accessible mais que l’appel échoue, vérifier `SOAPAction`, l’espace de noms, le type de contenu, la signature et les droits de l’appelant. Un refus depuis le poste de travail peut venir du pare-feu tandis que la même requête réussit depuis l’hôte. Une erreur `Stop-Process` peut coexister avec une instruction injectée ; regarder la réponse plutôt que classer toute erreur comme une preuve d’échec.

L’étape DNS possède sa propre provenance. L’enregistrement est créé dans une zone intégrée à AD grâce à une ACL autorisant un objet enfant, tandis que le lien SQL fournit le nom exact à résoudre. Contrôler le nom pleinement qualifié, pas seulement son étiquette courte : une différence de suffixe peut modifier la résolution du poste de test sans toucher celle du serveur SQL. Lorsque l’écouteur reçoit une connexion TDS, la relier à l’horaire de la requête liée et à l’adresse source avant de décoder le secret stocké. Cette corrélation distingue la voie étudiée d’un trafic SQL ordinaire.

## Contrôler l’enchaînement des permissions

| Frontière | Preuve à conserver | Pourquoi la suite est justifiée |
| --- | --- | --- |
| Partage vers SQL | `software$` fournit un exécutable avec une chaîne de connexion, puis SQL accepte ce compte sur TCP 6520. | Un secret décompilé reste un candidat jusqu’à son acceptation par la base. |
| SQL vers DNS | Le lien `SQL07` existe et le compte peut créer un objet enfant dans la zone DNS AD pertinente. | Ni le lien ni l’accès SQL ne donnent seuls le contrôle de l’adresse résolue. |
| DNS vers secret stocké | Le serveur SQL résout `SQL07` vers l’adresse contrôlée, appelle le lien et envoie une connexion TDS en authentification SQL. | Un paquet venant d’un autre hôte ou un échange NTLM soutiendrait une autre conclusion. |
| Secret vers hôte | `sqlmgmt` ouvre une session WinRM et `whoami /all` identifie le jeton. | Décoder un mot de passe stocké ne garantit pas qu’une connexion à l’hôte soit acceptée. |
| Hôte vers service | Le WSDL local expose `KillProcess` et la réponse du diagnostic annonce LocalSystem. | Atteindre le port 8000 ou recevoir HTTP 200 ne prouve pas l’exécution. |

Conserver dans les notes le nom DNS, son TTL, l’adresse de l’écouteur et les horaires des paquets. Un cache peut faire croire qu’un enregistrement corrigé ne marche pas ; la requête DNS et la connexion sortante du serveur SQL sont plus probantes qu’une résolution sur le poste de test. Pour WCF, relever la faute SOAP ou `KillProcessResult` ainsi que l’identité du processus de service. Si un groupe est modifié durant le test, rouvrir WinRM avant de contrôler les droits, car Windows établit le jeton lors de l’ouverture de session. Ces détails rendent la chaîne reproductible plutôt que de juxtaposer des sorties d’outils.

## Corriger et retester

Retirer les secrets des exécutables distribués et renouveler les identifiants SQL. Restreindre le partage et les droits du premier compte SQL. Supprimer ou réparer le lien `SQL07` vers un nom absent, protéger le transport de l’authentification SQL distante et limiter la création d’enregistrements DNS. Vérifier qu’un compte peu privilégié ne peut ni rediriger le lien ni récupérer son secret.

Remplacer la construction passée à `AddScript` par `AddCommand("Stop-Process")` et un paramètre `Name` typé, tout en contrôlant l’autorisation et les processus gérables. Exécuter WCF sous un compte dédié aux droits minimaux. Retester une opération légitime, un nom contenant un séparateur, le refus d’un appel non autorisé et l’identité réelle du service. Corréler les changements DNS, les appels au serveur lié et les opérations WCF dans les journaux permet de retrouver la chaîne complète.
