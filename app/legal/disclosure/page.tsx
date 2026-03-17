"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisclosurePage() {
  const paragraphs = [
    "Je mène mes recherches et activités de sécurité dans un cadre légal et éthique. Les tests ne sont effectués que sur des périmètres explicitement autorisés (contrats, programmes de bug bounty) et les preuves de concept sont limitées au minimum nécessaire.",
    "Mon approche de divulgation responsable s'inscrit dans les meilleures pratiques de l'industrie : autorisation explicite, respect des conditions d'utilisation des programmes, signalement coordonné et publication contrôlée des informations de sécurité.",
    "Pour les vulnérabilités découvertes, je privilégie toujours le signalement privé aux équipes concernées avec un délai raisonnable pour la correction, plutôt que la publication immédiate qui pourrait exposer inutilement les utilisateurs.",
    "Dans le cadre de mes travaux de recherche offensive, je m'engage à ne fournir aucune assistance opérationnelle à des usages malveillants. Tous mes travaux sont orientés pédagogie, amélioration des défenses et compréhension des mécanismes de sécurité.",
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="technical-grid absolute inset-x-0 top-0 -z-10 h-80 opacity-40" />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-frame px-6 py-10 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Badge variant="outline" className="mb-4">
              Ethique
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              Divulgation responsable & éthique
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Une pratique sécurité utile suppose un cadre explicite, proportionné et orienté
              remédiation.
            </p>
          </motion.div>

          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 grid gap-6 lg:grid-cols-2"
          >
            <Card className="surface-panel shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">Principes fondamentaux</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      Autorisation explicite et respect des conditions d&apos;utilisation des programmes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      Respect de la vie privée et limitation des accès aux données strictement nécessaires
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      Signalement responsable avec délais de correction raisonnables
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      Pas de publication d&apos;exploits avant correction et accord des parties
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-panel shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">Recherche offensive & pédagogie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Les travaux relatifs aux outils offensifs et à l&apos;analyse de sécurité sont
                  strictement orientés pédagogie, détection et amélioration des défenses. Aucune
                  assistance opérationnelle à un usage malveillant n&apos;est fournie.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/contact" className={buttonVariants()}>
              Discuter d&apos;un projet
            </Link>
            <Link href="/services" className={buttonVariants({ variant: "outline" })}>
              Voir mes services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
