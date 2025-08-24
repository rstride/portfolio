"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DisclosurePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold">Divulgation responsable & éthique</h1>
        <p className="text-muted-foreground">
          Je mène mes recherches et activités de sécurité dans un cadre légal et éthique. Les tests
          ne sont effectués que sur des périmètres explicitement autorisés (contrats, programmes de
          bug bounty) et les preuves de concept sont limitées au minimum nécessaire.
        </p>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Principes</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Autorisation explicite et respect des CGU des programmes.</li>
            <li>Respect de la vie privée, pas d’accès aux données réelles au-delà du strict nécessaire.</li>
            <li>Signalement responsable aux éditeurs avec délais de correction raisonnables.</li>
            <li>Pas de publication d’exploits utilisables avant correctif et accord des parties.</li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Recherche offensive (outils/malware)</h2>
          <p className="text-sm text-muted-foreground">
            Les travaux relatifs aux outils offensifs et au « malware » sont strictement orientés
            pédagogie, détection et amélioration des défenses. Aucune aide opérationnelle à un usage
            malveillant n’est fournie.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/contact" className="btn-primary">Contacter pour en savoir plus</Link>
        </div>
      </motion.div>
    </section>
  );
}

