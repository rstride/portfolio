---
id: "HTB-2026-INTERPRETER"
title: "Interpreter"
excerpt: "Sur **Interpreter**, l'accès initial est obtenu via une désérialisation XML non authentifiée (CVE-2023-43208) dans NextGen Mirth Connect 4.4.0, donnant un shell"
date: "2026-02-21"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "DESERIALIZATION", "CVE-2023-43208", "F-STRING-INJECTION"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "0x7CC"
published: true
---

# Hack The Box — Interpreter (Linux) Write-Up : RCE Mirth Connect CVE-2023-43208 → PrivEsc double f-string eval()

## TL;DR
Sur **Interpreter**, l'accès initial est obtenu via une désérialisation XML non authentifiée (CVE-2023-43208) dans NextGen Mirth Connect 4.4.0, donnant un shell en tant que `mirth`. Un dump de base de données permet d'obtenir le hash de `sedric` qui est cracké pour accéder au SSH. L'élévation s'effectue via une vulnérabilité de double évaluation de f-strings Python dans un script Flask local s'exécutant en root.

---

## Cible
- Host : `interpreter.htb`
- IP : `10.129.16.252`

---

## Recon : Ports ouverts et détection de Mirth Connect
Le scan réseau montre :
- **Port 22/tcp** : SSH
- **Port 80/443/tcp** : Mirth Connect Administrator (4.4.0)

La version 4.4.0 de NextGen Connect est vulnérable aux attaques de désérialisation XML XStream.

---

## Accès Initial : Désérialisation XStream (CVE-2023-43208)
Nous envoyons une charge XML malveillante exploitant XStream vers les servlets non authentifiées. Cela nous renvoie un shell sous l'utilisateur de service `mirth`.

---

## Accès Utilisateur : Extraction et cracking du hash PBKDF2
Nous trouvons les identifiants MariaDB dans `mirth.properties`. Dans la base de données, nous récupérons le hash PBKDF2 de `sedric` (étiré à 600 000 itérations).

Le crackage révèle le mot de passe : `snowflake1`. Nous nous connectons en SSH.

---

## Élévation de privilèges : Double évaluation f-string Python
Un script local `notif.py` écoute sur le port 54321 en root. Il évalue les données via `eval(f"f'''{template}'''")`.

Nous contournons le filtre regex (qui bloque les espaces et les virgules) en encodant notre payload en base64 :
```python
{__import__("os").popen(__import__("base64").b64decode("aW5zdGFsbCAtbyByb290IC1tIDQ3NTUgL2Jpbi9iYXNoIC90bXAvLnNo").decode()).read()}
```

L'envoi de cette charge génère un binaire SUID `/tmp/.sh` appartenant à root.

---

## Notes défensives / remédiation

### Correctif
- Mettre à jour NextGen Connect vers une version patchée.
- Ne jamais utiliser `eval()` avec des entrées utilisateur.

---

## Annexe : Résumé de la timeline
1. Détection de Mirth Connect 4.4.0.
2. Exploitation de CVE-2023-43208 et shell `mirth`.
3. Extraction de la base, cracking et connexion SSH `sedric`.
4. Exploitation de la double évaluation Python sur le port 54321 pour root.

---