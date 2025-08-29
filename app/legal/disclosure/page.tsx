"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DisclosurePage() {
  const paragraphs = [
    "Je mène mes recherches et activités de sécurité dans un cadre légal et éthique. Les tests ne sont effectués que sur des périmètres explicitement autorisés (contrats, programmes de bug bounty) et les preuves de concept sont limitées au minimum nécessaire.",
    "Mon approche de divulgation responsable s'inscrit dans les meilleures pratiques de l'industrie : autorisation explicite, respect des conditions d'utilisation des programmes, signalement coordonné et publication contrôlée des informations de sécurité.",
    "Pour les vulnérabilités découvertes, je privilégie toujours le signalement privé aux équipes concernées avec un délai raisonnable pour la correction, plutôt que la publication immédiate qui pourrait exposer inutilement les utilisateurs.",
    "Dans le cadre de mes travaux de recherche offensive, je m'engage à ne fournir aucune assistance opérationnelle à des usages malveillants. Tous mes travaux sont orientés pédagogie, amélioration des défenses et compréhension des mécanismes de sécurité."
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background effects - same as service pages */}
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
            Divulgation responsable & éthique
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

        {/* Additional content sections with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 space-y-6"
        >
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Principes fondamentaux</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Autorisation explicite et respect des conditions d'utilisation des programmes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Respect de la vie privée et limitation des accès aux données strictement nécessaires</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Signalement responsable avec délais de correction raisonnables</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Pas de publication d'exploits avant correction et accord des parties</span>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recherche offensive & pédagogie</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Les travaux relatifs aux outils offensifs et à l'analyse de sécurité sont strictement orientés pédagogie,
              détection et amélioration des défenses. Aucune assistance opérationnelle à un usage malveillant n'est fournie.
              Mon objectif est de contribuer à renforcer la sécurité globale en partageant connaissances et méthodologies
              de manière responsable et constructive.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/contact" className="btn-primary">Discuter d'un projet</Link>
          <Link href="/services" className="btn-outline">Voir mes services</Link>
        </motion.div>
      </div>
    </section>
  );
}

