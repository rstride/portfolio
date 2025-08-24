"use client";
import { site } from "@/content/site";
import { motion } from "framer-motion";
import Link from "next/link";
import { use as useUnwrap } from "react";

type Props = { params: Promise<{ slug: string }> };

export default function ServiceDetail({ params }: Props) {
  const { slug } = useUnwrap(params);
  const contentSlug = slug === "securite" ? "audit-securite" : slug;

  const service = site.services.find((s) => s.slug === contentSlug);
  type Detail = { intro: string; audience: string[]; process: string[] };
  const details = (site.servicePages as Record<string, Detail>)[contentSlug];

  if (!service) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold mb-2">Service introuvable</h1>
        <p className="text-muted-foreground mb-6">Le service demandé n’existe pas.</p>
        <Link href="/services" className="btn-primary">Retour aux services</Link>
      </section>
    );
  }

  const custom: Record<string, string[]> = {
    "pentest-web": [
      "Je réalise des tests d’intrusion applicatifs pour vos sites, APIs et back‑offices. Je combine tests manuels et outillage pour couvrir à la fois l’OWASP (authentification, gestion de session, contrôle d’accès, injections, SSRF…) et la logique métier propre à votre produit.",
      "Mon approche privilégie la démonstration de l’impact: je construis des preuves d’impact sûres (PoC contrôlés) et je documente les chemins d’attaque de bout en bout pour faciliter la compréhension par les équipes produit et sécurité.",
      "Avant l’intervention, nous cadrons le périmètre (environnements, utilisateurs de test, contraintes de charge), définissons les objectifs et les conditions d’exécution (VPN/allowlist si besoin, plages d’horaires, interlocuteurs).",
      "Je restitue un rapport clair et priorisé par le risque, avec recommandations pragmatiques et ressources de correction. Un retest est prévu pour valider les remédiations et réduire le temps d’exposition.",
      "Je m’inscris dans un cadre strictement autorisé et responsable (scope validé, données fictives, journalisation de mes actions)."
    ],
    "pentest-infra": [
      "Je mène des tests d’intrusion sur vos systèmes et réseaux (externe/interne) pour révéler les surfaces exposées, les faiblesses de configuration et les risques d’escalade.",
      "Le travail commence par une reconnaissance méthodique puis des vérifications ciblées des services exposés (chiffrement, durcissement, versions, failles connues, segmentation). En contexte interne, j’examine notamment l’exposition des services critiques et les chemins d’accès non prévus.",
      "Nous cadrons ensemble les plages d’intervention et les actifs sensibles pour éviter tout impact opérationnel, avec points de contact et fenêtre de changement si nécessaire.",
      "La restitution propose une feuille de route actionnable (patching, durcissement, segmentation, journalisation, sauvegardes) classée par priorité et effort, suivie d’un retest pour valider les corrections.",
      "L’ensemble est réalisé dans un cadre légal et autorisé, avec une attention continue à la sécurité des données."
    ],
    "audit-securite": [
      "J’évalue votre posture de sécurité de manière concrète: gouvernance, politiques, configurations clés, gestion des accès, sauvegardes, détection et réponse, vulnérabilités et exposition.",
      "L’objectif est de fournir une vision claire de vos forces et angles morts, puis de prioriser les actions à fort impact. Je m’appuie sur des entretiens courts, des revues de configuration et des preuves d’échantillonnage.",
      "Le livrable central est une feuille de route priorisée et réaliste (quick wins, chantiers structurants, indicateurs de suivi), assortie de recommandations pragmatiques et d’un plan de mise en œuvre.",
      "Je peux ensuite accompagner vos équipes pour mettre en place les mesures retenues et suivre la réduction du risque dans le temps (approche CTEM)."
    ],
    "ctf": [
      "J’organise des CTF pédagogiques pour former et fédérer vos équipes autour de la sécurité offensive — du niveau débutant à avancé.",
      "Nous fixons ensemble les objectifs (acculturation, recrutement, montée en compétences) et le format (présentiel/distanciel, durée, scoring). Je conçois des épreuves adaptées (web, réseau, forensics, crypto) avec un niveau progressif et des explications claires.",
      "Je fournis la plateforme, le support d’animation, le scoreboard et le debrief. Les participants repartent avec des bonnes pratiques concrètes et des pistes pour continuer à progresser.",
      "L’événement est cadré pour rester sûr, légal et respectueux de vos contraintes (données fictives, périmètre isolé)."
    ],
    "formation-ia": [
      "Je propose une formation pratique aux fondamentaux de l’IA générative pour des usages maîtrisés en sécurité et côté produit.",
      "Au programme: fonctionnement des LLM, bonnes pratiques de rédaction de prompts, limites et risques (exfiltration, injection, hallucinations), et intégration responsable dans les workflows.",
      "La formation est adaptée à votre contexte et illustrée par des exercices concrets. Je fournis un kit de démarrage (supports, templates, checklist) pour ancrer les acquis dans la durée.",
      "Option d’approfondissement: atelier dédié à la sécurisation des usages de l’IA dans vos applications et process internes."
    ],
    "sensibilisation": [
      "Je conçois des sessions de sensibilisation concrètes et adaptées à vos métiers: phishing, gestion des secrets, mots de passe, outils non approuvés (Shadow IT), mobilité.",
      "Les formats sont courts, interactifs et actionnables (exemples réels, mises en situation, Q&A). Je peux piloter une campagne de phishing simulé pour mesurer et améliorer les réflexes.",
      "Les livrables incluent les supports, guides de bonnes pratiques et indicateurs de suivi pour objectiver les progrès et ajuster le dispositif.",
      "Objectif: ancrer des comportements sûrs sans freiner l’activité, et faire de la sécurité un réflexe partagé."
    ]
  };

  const paragraphs: string[] = custom[contentSlug] || [];
  if (paragraphs.length === 0) {
    // Fallback sur le contenu générique si aucun texte sur‑mesure n’est défini
    if (service.description) paragraphs.push(service.description);
    if (details?.intro) paragraphs.push(details.intro);
    if (details?.audience?.length) paragraphs.push(`Pour: ${details.audience.join(', ')}.`);
    if (details?.process?.length) paragraphs.push(`Démarche: ${details.process.join(' → ')}.`);
    if (service.deliverables?.length) paragraphs.push(`Livrables: ${service.deliverables.join(' · ')}.`);
    if (service.benefits?.length) paragraphs.push(`Bénéfices: ${service.benefits.join(' · ')}.`);
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
          animate={{ backgroundPosition: ["0px 0px", "50px 50px", "0px 0px"], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {service.title}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded" />
        </motion.div>

        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className="text-lg leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 * i }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * paragraphs.length + 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/contact" className="btn-primary">Discuter de ce service</Link>
          <Link href="/services" className="btn-outline">Tous les services</Link>
        </motion.div>
      </div>
    </section>
  );
}
