---
id: "HTB-2026-OVERWATCH"
title: "Overwatch"
excerpt: "Un outil partagé expose des identifiants SQL ; l’authentification d’un serveur lié et la concaténation PowerShell dans WCF franchissent deux frontières distinctes."
date: "2026-02-07"
updated: "2026-10-13"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MEDIUM", "NTLM-CAPTURE", "WCF-SERVICE", "COMMAND-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## Chaîne et limites des preuves

Le récit d’Overwatch décrit un partage SMB `software$` lisible, des identifiants récupérés dans `overwatch.exe`, SQL sur le port 6520 et un service de gestion WCF sur le port 8000. Il rapporte ensuite une session `sqlmgmt` et un abus de `KillProcess` donnant des droits administratifs.

L’étape intermédiaire doit être nuancée : le récit n’explique ni comment la requête au serveur lié est dirigée vers le listener de capture, ni comment l’authentification capturée devient le mot de passe utilisé en WinRM. Ce sont des étapes nécessaires, pas des conséquences automatiques du lancement de Responder.

## Identifiants et authentification sortante

Lire un exécutable partagé ou sa configuration peut révéler une chaîne de connexion. L’identifiant obtenu permet un login SQL si le serveur l’accepte ; il n’établit pas encore un accès au système.

La requête conservée illustre l’opération décrite :

```sql
EXEC ('SELECT 1') AT [SQL07];
```

`SQL07` est le nom de lien rapporté. Cette instruction nécessite un mapping adapté et RPC OUT. L’authentification sortante dépend de la destination réelle, du protocole et de la configuration. Microsoft décrit [l’exécution via un serveur lié](https://learn.microsoft.com/en-us/sql/relational-databases/linked-servers/linked-servers-database-engine) ; la requête ne démontre pas à elle seule le contrôle de sa destination par l’attaquant.

Une capture NTLM obtient normalement un challenge-response, pas un mot de passe en clair ni le hash NT brut du compte. Une récupération hors ligne nécessite des essais de mots de passe ; un relais nécessite un service compatible et ses propres prérequis. Ce sont deux chemins distincts. Voir la [présentation NTLM de Microsoft](https://learn.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm). Le récit rapporte des identifiants `sqlmgmt` fonctionnels sans en démontrer la dérivation.

## L’entrée WCF devient du code PowerShell

En prenant l’accès ultérieur comme une condition rapportée, le récit fournit cet extrait vulnérable :

```csharp
string scriptContents = "Stop-Process -Name " + processName + " -Force";
pipeline.Commands.AddScript(scriptContents);
```

Le nom de processus non fiable est analysé comme une partie du script. Un séparateur peut introduire une autre instruction au lieu de désigner un processus. L’exploitation nécessite aussi l’accès à la méthode, une authentification acceptée et une identité privilégiée du service.

Le récit rapporte une exécution LocalSystem et une modification du groupe Administrators local. Ajouter un membre n’équivaut pas à observer un shell SYSTEM ; un nouveau jeton de connexion doit porter les droits concernés. Le contrat complet et la requête WCF sont absents : l’invocation du proxy initiale n’est pas présentée comme une reproduction vérifiée.

## Corriger l’opération puis retester

Employer des commandes et paramètres typés plutôt qu’une concaténation de script. Ce remplacement illustratif nécessite encore une autorisation et des règles de sélection adaptées à l’application :

```csharp
using var ps = System.Management.Automation.PowerShell.Create();
ps.AddCommand("Stop-Process")
  .AddParameter("Name", processName)
  .AddParameter("Force");
ps.Invoke();
```

[L’API AddCommand](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.powershell.addcommand) sépare commande et paramètres. Le paramétrage supprime cette frontière de parsing ; il n’autorise pas l’arrêt de n’importe quel processus.

Renouveler les identifiants SQL exposés, les retirer des binaires distribués, restreindre le partage et les flux sortants SQL, et limiter les droits du service de gestion. En test, soumettre un nom contenant un séparateur et vérifier qu’aucune seconde opération ne démarre. Vérifier le refus des appelants non autorisés et le maintien des opérations approuvées.

Surveiller les authentifications sortantes de SQL, les opérations du service et les changements de groupes locaux, en les reliant à l’identité appelante. Ne pas confondre capture NTLM et mot de passe retrouvé.
