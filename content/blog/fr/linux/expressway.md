---
id: "HTB-2025-002"
title: "Expressway"
excerpt: "Expressway illustre trois faiblesses distinctes : une clé IKEv1 facile à deviner, sa réutilisation pour SSH et des comportements sudo permettant une élévation locale sous certaines conditions."
date: "2025-09-20"
updated: "2026-10-15"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "EASY", "VPN", "IPSEC", "IKE", "PRIVESC"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "EASY"
icon: "Terminal"
author: "0x7CC"
---

## Commencer par les bons protocoles

La chaîne est **IKE Aggressive Mode → récupération hors ligne de la PSK → SSH comme `ike` → contournement de la politique d’hôte sudo ou voie chroot vulnérable → root**. Le secret VPN n’est pas automatiquement un identifiant SSH : sa réutilisation constitue une faiblesse supplémentaire. De même, la version sudo seule ne détermine pas le chemin local disponible. Deux CVE apparaissent dans les solutions publiques, avec des prérequis différents.

`expressway.htb` est l’hôte du laboratoire. `<LAB_IP>` représente son adresse et `<LAB_PSK>` le secret retrouvé. Les commandes sont des diagnostics sur la machine autorisée ; aucun secret ni flag n’est reproduit.

## Confirmer le service UDP

Un scan TCP montre SSH. Le service intéressant écoute sur UDP 500 ; UDP 4500 intervient aussi dans la traversée NAT d’IPsec. UDP 69 peut apparaître lors d’une reconnaissance ciblée, mais sa présence ne fournit pas à elle seule un fichier de configuration. Contrairement à TCP, l’absence de réponse à une sonde UDP produit souvent `open|filtered`, état ambigu. Une sonde propre à IKE permet de confirmer le VPN. Le [guide Nmap sur UDP](https://nmap.org/book/scan-methods-udp-scan.html) explique cette limite.

Depuis le poste de travail :

```bash
sudo nmap -sU -sV -p 500,4500,69 expressway.htb
ike-scan -A expressway.htb
```

`-sU` sélectionne UDP et `-sV` cherche à identifier le service. `ike-scan -A` demande IKEv1 Aggressive Mode. Relever la proposition du serveur, l’identité et le type d’authentification. Une identité comme `ike@expressway.htb` est une identité IKE ; elle ne prouve pas l’existence d’un compte Unix, même si elle oriente les vérifications suivantes.

## Comprendre les essais hors ligne

En mode agressif IKEv1, des éléments de l’échange de clés et une valeur d’authentification sont disponibles dans la négociation. Avec une PSK, un testeur peut comparer des mots de passe candidats à cet échange capturé, sans se reconnecter au VPN à chaque essai. La construction figure dans la [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.html). Il faut encore une capture complète et bien formatée et un secret assez faible pour être deviné. La seule possession d’une empreinte ne révèle pas la PSK.

Pour un rejeu rigoureux, sauvegarder l’échange au format attendu par l’outil choisi, vérifier identité et proposition, puis tester les candidats localement. Noter la version de l’outil et le format, au lieu de recopier un mode de cracking supposé. Sans réponse IKE, rechercher filtrage UDP, erreur d’adresse, version et propositions IKE ou mode agressif désactivé. Un échec de recherche ne prouve pas l’absence du service ; la PSK peut simplement être forte.

Dans le laboratoire, la PSK retrouvée fonctionne aussi comme mot de passe SSH de `ike`. Tester séparément cette réutilisation. La connexion SSH suivie de `id` établit le compte OS ; l’échange IKE ne donne aucun shell. Changer seulement la PSK VPN laisserait un risque si l’ancien mot de passe était encore accepté en SSH.

## Distinguer les deux chemins sudo

Après SSH, inventorier les binaires sudo et les droits :

```bash
command -v sudo
/usr/bin/sudo --version
/usr/local/bin/sudo --version
ls -l /usr/bin/sudo /usr/local/bin/sudo
sudo -l
```

Tous ces chemins ne sont pas nécessairement présents dans chaque image. `command -v` identifie le binaire choisi par le shell ; les appels explicites distinguent deux copies et leurs permissions. Mettre à jour le paquet de `/usr/bin/sudo` ne corrige pas une copie SUID installée sous `/usr/local/bin`.

La voie directe du laboratoire concerne CVE-2025-32462 : le nom d’hôte fourni à sudo avec `-h` peut influencer incorrectement l’évaluation d’une politique sudoers liée à l’hôte. Un nom tel que `offramp.expressway.htb` est repérable dans un journal Squid de la machine. Un utilisateur autorisé doit comparer `sudo -l` sur le véritable hôte et sur ce nom avant d’essayer une commande. Il faut une règle sudoers dont la partie hôte autorise la commande sous ce nom alternatif. Un nom inventé ou une version touchée sans règle applicable ne suffit pas. La démonstration doit identifier le binaire, le nom ayant correspondu et l’identité effective obtenue. L’[avis du projet sudo](https://www.sudo.ws/security/advisories/host_any/) détaille le défaut.

Une autre voie utilise CVE-2025-32463. Dans certaines versions amont, l’option chroot peut faire charger à sudo une configuration NSS et du code contrôlés par l’utilisateur avant l’application de la politique. Elle ne dépend pas d’une commande accordée dans sudoers, mais exige un binaire vulnérable avec SUID, une préparation du système de fichiers et un outil adapté au build. La [divulgation initiale](https://www.stratascale.com/resource/cve-2025-32463-sudo-chroot-elevation-of-privilege/) présente les versions et le correctif. Une bannière de version n’exclut pas un correctif rétroporté. Il faut consigner quelle voie a réellement produit root plutôt que fusionner les deux CVE.

## Diagnostiquer et corriger

Si le nom alternatif ne fonctionne pas, examiner les alias d’hôte sudoers, vérifier la pertinence du nom trouvé dans les journaux et l’interprétation de `-h` par le binaire appelé. Une erreur de résolution DNS n’indique pas forcément un refus de la politique. Si la voie chroot échoue, contrôler provenance exacte du binaire, niveau de correction, architecture et prérequis de l’outil. Si SSH refuse la PSK, vérifier la récupération du secret et la présence réelle de la réutilisation.

Désactiver IKEv1 Aggressive Mode si possible, employer des secrets VPN longs et indépendants ou des certificats, puis renouveler PSK et mot de passe SSH exposés. Corriger toutes les copies privilégiées de sudo ou retirer les builds locaux non maintenus. Auditer les règles sudoers spécifiques aux hôtes et les autorisations `ALL` inutiles. Le retest doit refuser l’ancien secret VPN et SSH, maintenir le VPN approuvé, rejeter l’autorisation sudo sur le faux hôte et constater un binaire corrigé sur chaque chemin SUID. Surveiller négociations IKE inattendues, accès SSH par les identités VPN et appels sudo avec hôte ou chroot inhabituels. Les essais hors ligne de PSK ne produisent pas une série d’échecs de connexion en ligne.
