---
title: "KFS — Kernel From Scratch"
order: 3
summary: "Développement d’un noyau x86 de type Unix en Rust et assembleur, du premier démarrage aux processus utilisateurs isolés et à un système de fichiers ext2 persistant."
role: "Développeur noyau · École 42"
period: "École 42 · KFS 1–6"
tags: ["X86", "RUST", "ASSEMBLY", "MEMORY MANAGEMENT", "EXT2", "QEMU"]
externalUrl: "https://github.com/rstride/kfs"
externalLabel: "Voir le code sur GitHub"
coverImage: "/projects/kfs-kernel.webp"
coverFit: "contain"
coverAlt: "Illustration de l’architecture KFS : démarrage, noyau Rust, processus utilisateurs isolés et stockage ext2"
ogImage: "/projects/kfs-og.png"
seoTitle: "KFS : un noyau x86 en Rust à l’École 42 | Romain Stride"
seoDescription: "Développement d’un noyau x86 pédagogique à l’École 42 : Rust, assembleur, pagination, interruptions, processus ring 3, ext2 et tests sous QEMU."
updated: "2026-10-30"
published: true
---

## Le défi

De quoi une application dépend-elle avant d’exécuter sa première instruction ? KFS explore cette question en construisant les fondations du système : démarrage, gestion mémoire, interruptions, isolation des processus et accès au disque.

Réalisé dans le cadre du cursus **Kernel From Scratch** de l’École 42, ce noyau pédagogique de type Unix cible l’architecture x86 32 bits. Rust porte la logique du noyau, tandis que l’assembleur gère l’amorçage et les transitions du processeur. L’ensemble fonctionne sans environnement d’exécution hôte ni bibliothèque standard.

## Mon travail

Mon travail couvre six étapes compilables indépendamment, qui relient les mécanismes matériels à des services noyau progressivement plus complets :

1. **Démarrage et affichage :** point d’entrée Multiboot, script de liaison, chargement par GRUB et sortie texte VGA.
2. **Segmentation et interaction :** Global Descriptor Table, saisie clavier et shell interactif.
3. **Mémoire :** pagination de 4 Kio, allocateurs physiques et virtuels, tas Rust et diagnostic des fautes.
4. **Interruptions :** Interrupt Descriptor Table, configuration PIC/PIT, IRQ clavier et callbacks noyau différés.
5. **Processus :** exécution en ring 3, espaces d’adressage privés, préemption par timer, fork/wait/exit, signaux et paires de sockets locales.
6. **Persistance :** accès disque PCI IDE, ext2 en lecture et écriture, commandes de fichiers et répertoires de travail propres aux processus.

## Mémoire et frontières de privilèges

La pagination sépare les pages utilisateurs de la mémoire noyau réservée au superviseur. Chaque processus utilisateur possède son espace d’adressage et sa pile noyau. Le changement de processus restaure un contexte processeur sauvegardé et sélectionne le répertoire de pages correspondant.

L’interface des processus vérifie les pointeurs utilisateurs et les plages complètes des buffers avant d’y accéder. Fork copie les pages utilisateurs ; la terminaison et la récupération des processus libèrent leurs ressources. Un échec d’allocation doit être annulé sans fuite de pages ni processus partiellement construit.

Rust aide à structurer ces règles de propriété. Les accès mémoire bruts, les entrées-sorties sur les ports et les transitions du processeur demandent toujours un raisonnement explicite au niveau matériel.

## De la mémoire aux fichiers persistants

La sixième étape relie un pilote PCI IDE à une implémentation d’ext2. Fichiers, répertoires, liens physiques, liens symboliques et permissions deviennent accessibles depuis le shell, avec conservation des données entre les démarrages.

Les mutations préparent les blocs modifiés avant leur écriture synchrone et la vidange du cache disque. L’implémentation contrôle la géométrie du volume, les entrées de répertoire et les pointeurs de blocs avant utilisation. Ext2 n’est pas journalisé ici : une interruption pendant une écriture de plusieurs blocs peut encore laisser des métadonnées incohérentes.

## Tester le noyau en exécution

Le dépôt contient des tests d’intégration qui démarrent le véritable noyau sous **QEMU**. Ils exercent l’épuisement mémoire et l’annulation des allocations, les fautes matérielles, la préemption, les contrôles de privilèges, les signaux et les opérations sur les fichiers.

Les vérifications du système de fichiers inspectent aussi les images écrites par le noyau avec `e2fsck` et `debugfs`, puis redémarrent pour vérifier la persistance. La [documentation de cette étape](https://github.com/rstride/kfs/blob/main/kfs_6/README.md) décrit les contrôles et les commandes de compilation.

## Ce que ce projet démontre

- Comprendre les mécanismes qui permettent l’exécution et l’isolation des applications.
- Relier les abstractions Rust aux contraintes matérielles et aux interfaces assembleur.
- Raisonner sur la propriété des ressources, leur libération et les chemins d’échec entre sous-systèmes.
- Rendre le comportement bas niveau observable grâce aux diagnostics et aux tests d’intégration exécutables.

KFS est un noyau pédagogique au périmètre volontairement limité. Le [dépôt source](https://github.com/rstride/kfs) documente chaque étape, ses interfaces et ses limites actuelles.
