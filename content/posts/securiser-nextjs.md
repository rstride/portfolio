---
title: "Sécuriser une application Next.js : Les bases indispensables"
date: "2025-05-15"
excerpt: "Next.js facilite la création d’applications modernes, mais n’apporte pas la sécurité par défaut. Voici les bases vraiment utiles pour réduire les risques sur une application Next.js en production."
tags: ["nextjs", "securite", "web", "react"]
coverImage: "/blog/PrismaLogo.svg"
---

Next.js est un excellent framework pour construire des applications web rapides et agréables à maintenir. Mais comme souvent en sécurité, le confort de développement ne garantit pas la sûreté du résultat.

Beaucoup d’équipes pensent encore qu’utiliser un framework moderne suffit à éliminer une grande partie du risque. En pratique, Next.js réduit certaines erreurs, mais il n’empêche ni les mauvais choix d’architecture, ni les problèmes d’authentification, ni les expositions de données, ni les failles logiques.

Autrement dit : une application Next.js reste une application web. Elle doit donc être sécurisée comme telle.

Voici les bases les plus importantes à traiter si vous voulez éviter les erreurs classiques.

## Comprendre ce que Next.js protège et ce qu’il ne protège pas

Next.js apporte plusieurs choses utiles :

- un modèle clair entre code client et code serveur
- du rendu côté serveur ou statique selon le besoin
- une bonne intégration des routes et des APIs
- des protections implicites héritées de React sur certains usages

Mais il ne protège pas automatiquement contre :

- les contrôles d’accès insuffisants
- les secrets mal gérés
- les données sensibles renvoyées au client
- les endpoints mal protégés
- les erreurs de logique métier
- les uploads dangereux
- les `dangerouslySetInnerHTML` mal utilisés
- les défauts de configuration HTTP

Le bon point de départ est donc simple : ne pas confondre modernité du framework et niveau de sécurité réel.

## 1. Séparer clairement ce qui doit rester côté serveur

Avec Next.js, il est facile de mélanger des responsabilités sans s’en rendre compte, surtout quand une base de code grandit vite.

La première discipline utile consiste à poser une frontière nette :

- ce qui touche aux secrets reste côté serveur
- ce qui vérifie les droits reste côté serveur
- ce qui décide si un utilisateur peut voir ou modifier une donnée reste côté serveur
- ce qui est envoyé au navigateur doit être considéré comme exposable

En pratique, cela veut dire qu’il faut être très prudent avec :

- les props hydratées côté client
- les données sérialisées depuis le serveur
- les variables d’environnement exposées
- les objets utilisateur envoyés “par commodité”

Une erreur classique consiste à récupérer un objet riche côté serveur, puis à l’envoyer tel quel à un composant client alors qu’une petite partie seulement était nécessaire.

Le principe est simple : n’envoyez au client que ce qu’il doit réellement afficher ou utiliser.

## 2. Bien gérer les variables d’environnement

Dans un projet Next.js, la gestion des variables d’environnement mérite une attention particulière parce qu’une confusion de préfixe peut transformer une donnée privée en donnée exposée.

Le réflexe de base :

- tout ce qui est préfixé par `NEXT_PUBLIC_` est destiné au client
- tout ce qui ne l’est pas doit rester côté serveur

Cela paraît simple, mais c’est une source fréquente d’erreur.

Quelques règles utiles :

- ne jamais mettre de secret dans une variable `NEXT_PUBLIC_*`
- éviter de copier/coller des variables sans réfléchir au contexte d’usage
- relire les fichiers de configuration et les appels aux SDK tiers
- limiter le nombre de secrets effectivement disponibles dans l’environnement runtime

Les secrets les plus sensibles sont généralement :

- clés d’API privées
- credentials de base de données
- tokens de service
- secrets de signature
- mots de passe SMTP ou fournisseurs tiers

Si un secret est requis pour une action métier, cette action doit être exécutée côté serveur, pas dans le navigateur.

## 3. Ne jamais faire confiance au client pour l’autorisation

Le fait qu’un bouton soit caché dans l’interface ne signifie rien du point de vue de la sécurité.

Dans une application Next.js, les contrôles d’autorisation doivent toujours être appliqués côté serveur, au plus près de l’action sensible.

Cela concerne notamment :

- les Server Actions
- les route handlers dans `app/api`
- les endpoints internes
- les accès aux données en base

Les erreurs les plus fréquentes ressemblent à cela :

- vérifier le rôle dans le front mais pas dans l’API
- vérifier qu’un utilisateur est connecté, mais pas qu’il a le bon droit
- filtrer une liste dans l’UI, mais laisser l’accès direct à l’ID dans la route
- supposer qu’un identifiant reçu du client est légitime

La bonne question n’est pas “l’interface affiche-t-elle cette action ?”.  
La bonne question est : “si quelqu’un appelle directement l’endpoint ou la Server Action, est-ce que le contrôle tient encore ?”

## 4. Sécuriser les Server Actions et les routes API

Les Server Actions apportent du confort, mais elles peuvent aussi donner une fausse impression de sécurité si leur logique n’est pas cadrée.

Pour chaque action sensible, il faut explicitement vérifier :

- qui appelle l’action
- sur quelle ressource
- avec quel droit
- dans quel état métier

Même logique pour les routes API.

Une route n’est pas sûre parce qu’elle est “interne au projet”. Elle devient sûre si :

- l’authentification est correcte
- l’autorisation est correcte
- les entrées sont validées
- les erreurs n’exposent pas trop d’information
- la logique métier résiste aux abus évidents

Les validations d’entrée doivent porter sur :

- types
- formats
- tailles
- valeurs attendues
- listes blanches quand c’est pertinent

Une validation stricte réduit beaucoup de comportements imprévus et simplifie aussi le débogage.

## 5. Attention aux données exposées dans le rendu

Avec le SSR, le SSG, l’ISR et les composants serveur, il est facile d’oublier qu’une partie des données calculées finit quand même dans la réponse HTML ou dans le payload hydraté.

Quelques points d’attention :

- ne pas inclure de champs sensibles “au cas où”
- ne pas exposer des IDs internes si cela n’a aucune utilité
- ne pas envoyer de flags d’autorisation détaillés sans nécessité
- ne pas précharger des données que l’utilisateur ne devrait pas connaître

Ce sujet est particulièrement important pour :

- les dashboards
- les interfaces admin
- les espaces clients
- les pages multi-tenant

Si une donnée ne doit pas être visible par un utilisateur, elle ne doit pas être incluse dans le rendu envoyé à son navigateur.

## 6. Configurer des headers HTTP utiles

Les headers de sécurité ne corrigent pas une mauvaise logique applicative, mais ils restent une couche de durcissement utile.

Les plus fréquents à considérer sont :

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Content-Security-Policy`
- `Permissions-Policy`
- `X-Frame-Options` ou une directive équivalente dans la CSP selon le besoin

L’objectif n’est pas d’empiler des headers au hasard. Il faut surtout :

- forcer HTTPS
- limiter certaines interprétations dangereuses du navigateur
- réduire les surfaces liées à l’exécution de contenu
- cadrer les origines autorisées pour les scripts, images, frames ou connexions

Une CSP mérite une vraie réflexion, surtout si l’application utilise :

- scripts tiers
- analytics
- providers externes
- widgets embarqués
- contenus dynamiques

Une CSP mal pensée peut soit casser l’application, soit devenir trop permissive pour être utile.

## 7. Faire très attention à `dangerouslySetInnerHTML`

Le nom de l’API est explicite pour une raison.

React protège par défaut contre beaucoup d’injections lors du rendu standard. Dès que vous contournez ce mécanisme pour injecter du HTML, vous devez considérer que vous ouvrez une zone sensible.

Le risque apparaît si le contenu vient :

- d’un CMS
- d’un éditeur riche
- d’un markdown non maîtrisé
- d’un contenu utilisateur
- d’une source externe

Si ce HTML n’est pas proprement assaini avant injection, vous créez potentiellement une surface XSS.

Le bon réflexe :

- éviter cette approche si elle n’est pas nécessaire
- assainir le contenu avec une stratégie sérieuse
- définir précisément ce qui est autorisé
- tester les cas dégradés

Le fait que le contenu passe ensuite par React ne suffit pas à le rendre sûr.

## 8. Encadrer les uploads et les fichiers

Les applications Next.js qui permettent de téléverser des fichiers ont souvent une surface d’attaque sous-estimée.

Les vérifications utiles incluent :

- taille maximale
- types MIME attendus
- extensions autorisées
- nommage sûr
- stockage hors exécution directe si possible
- contrôle antivirus ou pipeline d’analyse selon le contexte

Il faut aussi se poser les bonnes questions :

- le fichier sera-t-il ensuite servi publiquement ?
- peut-il contenir du HTML, du SVG, du JavaScript ou du contenu actif ?
- l’utilisateur peut-il remplacer un fichier existant ?
- l’URL de téléchargement est-elle prédictible ?

Un upload non maîtrisé peut devenir un point d’entrée sérieux, surtout dans les espaces d’administration ou les workflows documentaires.

## 9. Gérer correctement l’authentification et la session

Next.js s’intègre avec de nombreuses solutions d’authentification, mais la sécurité réelle dépend surtout de la manière dont la session est gérée.

Quelques points de base :

- cookies marqués `HttpOnly` quand c’est pertinent
- usage de `Secure` en production
- politique `SameSite` adaptée
- durée de session cohérente
- invalidation claire lors de la déconnexion ou des changements sensibles

Il faut aussi surveiller :

- les élévations de privilège
- les changements d’adresse e-mail ou de mot de passe
- les flux de réinitialisation de mot de passe
- les endpoints appelés avant authentification complète

Une authentification “qui marche” n’est pas forcément une authentification robuste.

## 10. Maîtriser le cache et les comportements de rendu

Avec Next.js, les mécanismes de cache et de rendu sont puissants, mais ils peuvent provoquer des fuites ou des incohérences si on les utilise sans vigilance.

Le point le plus important : une donnée personnalisée ou sensible ne doit jamais être servie depuis un cache prévu pour du contenu partagé.

Il faut être particulièrement prudent sur :

- les pages personnalisées
- les réponses conditionnées par l’utilisateur
- les fragments contenant des données privées
- la revalidation de pages dépendant d’un état d’accès

Une confusion entre contenu public, contenu semi-public et contenu strictement privé peut suffire à exposer des informations à la mauvaise personne.

## 11. Soigner la gestion des dépendances

Les dépendances restent une source classique de risque.

Dans un projet Next.js, cela concerne :

- le framework lui-même
- l’écosystème React
- les bibliothèques d’auth
- les composants UI
- les packages de parsing, markdown, upload ou image

Quelques bonnes pratiques simples :

- suivre les mises à jour de sécurité
- limiter les dépendances non essentielles
- éviter les packages peu maintenus
- auditer les bibliothèques très sensibles
- comprendre ce que fait réellement un package critique

Le plus gros risque n’est pas seulement “avoir une dépendance vulnérable”. C’est aussi intégrer une dépendance puissante sans mesurer son impact sur la surface d’attaque.

## 12. Ne pas oublier la journalisation et la réaction

Une application plus sûre n’est pas seulement une application mieux codée. C’est aussi une application qui permet de voir ce qui se passe quand quelque chose tourne mal.

Pensez à journaliser de manière utile :

- échecs d’authentification significatifs
- actions sensibles
- erreurs serveur importantes
- comportements anormaux
- usages abusifs évidents

Mais attention :

- ne logguez pas de secrets
- évitez les données personnelles inutiles
- ne laissez pas des traces sensibles accessibles trop largement

L’objectif est d’aider à détecter, comprendre et contenir un incident, pas de créer une nouvelle fuite de données dans les logs.

## 13. Tester la sécurité au-delà du framework

Même avec de bonnes pratiques, certaines failles n’apparaissent qu’en testant l’application dans son contexte réel.

Sur une application Next.js, un test sérieux regardera souvent :

- l’authentification
- les contrôles d’accès
- les endpoints API
- les rôles et permissions
- les parcours critiques
- les failles web classiques
- les erreurs métier exploitables

Si votre application expose un espace client, une API ou des opérations sensibles, un [pentest web/API](/services/pentest) permet de vérifier ce qui est réellement exploitable, au-delà de la qualité perçue du code.

Et si le besoin est plus large que l’application elle-même, un [audit sécurité](/blog/quand-faire-audit-securite) peut aider à prioriser les sujets avant de disperser les efforts.

## Les erreurs les plus fréquentes sur un projet Next.js

Pour résumer, les erreurs les plus classiques sont souvent :

- exposer trop de données au client
- oublier les contrôles d’autorisation côté serveur
- mal gérer les secrets
- utiliser `dangerouslySetInnerHTML` sans vraie maîtrise
- négliger les headers HTTP
- sous-estimer les routes API et Server Actions
- mal cadrer cache et rendu
- faire confiance à l’interface au lieu de faire confiance au serveur

Ce ne sont pas des problèmes propres à Next.js, mais le framework ne les empêche pas à votre place.

## Conclusion

Sécuriser une application Next.js consiste moins à chercher une recette magique qu’à traiter sérieusement les fondamentaux : séparation client/serveur, contrôles d’accès, validation des entrées, protection des secrets, gestion des fichiers, configuration HTTP et revue des parcours sensibles.

Le framework aide à construire vite. Il ne remplace ni l’architecture, ni les contrôles, ni la vérification réelle du risque.

Si vous avez une application Next.js exposée et que vous voulez savoir ce qui est réellement exploitable, vous pouvez me décrire le contexte via la page [contact](/contact) ou consulter le format de [pentest web/API](/services/pentest).
