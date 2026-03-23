import Image from 'next/image';
import Link from 'next/link';
import { Globe, Network, Code, Cloud, Cpu, ShieldAlert, Terminal, GraduationCap } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <section className="min-h-[85vh] flex flex-col justify-center py-12 xl:py-20">
        <div className="hero-frame">
          <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
            Portfolio // v3.1
          </span>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16 items-end">
            <div className="xl:col-span-7 2xl:col-span-8">
              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl 2xl:text-[7.5rem] font-bold uppercase tracking-tighter leading-[0.9] text-on-surface mb-8 2xl:mb-10">
                PENTESTER <span className="text-secondary">&amp;</span> DÉVELOPPEUR <br /> SÉCURITÉ
              </h1>

              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mb-12 font-light">
                Pentester freelance et alumni de l&apos;École 42, spécialisé dans la recherche de vulnérabilités et l&apos;exploitation bas niveau. Avec une forte expertise en C et Assembleur, je décortique les systèmes pour en comprendre les failles fondamentales.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all terminal-glow active:scale-95 inline-block">
                  Prendre_contact
                </Link>
                <Link href="/services" className="border border-outline-variant/30 text-primary font-mono text-sm font-bold uppercase px-8 py-4 hover:bg-surface-container transition-all active:scale-95 inline-block">
                  Voir_mes_services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="py-32 relative overflow-hidden">
        <div className="page-frame">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[3/4] bg-surface-container-highest border border-outline-variant/20 relative p-2">
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10"></div>
                <div className="w-full h-full border border-primary/10 relative overflow-hidden grayscale contrast-125 opacity-80">
                  <Image
                    src="https://picsum.photos/seed/hacker/800/1000"
                    alt="Operator Profile"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary text-on-primary p-4 font-mono text-xs uppercase tracking-widest font-bold z-20 shadow-lg">
                  OPERATOR_ID: 0x7E3
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-secondary"></div>
                <span className="font-mono text-xs uppercase text-secondary tracking-widest">À propos de l&apos;opérateur</span>
              </div>

              <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase mb-10 leading-tight text-on-surface">
                PHILOSOPHIE DES <br /> OPÉRATIONS OFFENSIVES
              </h2>

              <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg font-light">
                <p>
                  Je suis un pentester freelance passionné par la sécurité offensive et l&apos;ingénierie inverse. Formé à l&apos;École 42, j&apos;ai forgé mes compétences techniques à travers la pratique intensive et le <span className="text-primary italic font-normal">peer-to-peer learning</span>.
                </p>
                <p>
                  Mon approche de la cybersécurité repose sur le partage de connaissances : je suis convaincu que c&apos;est en collaborant et en documentant nos découvertes que nous grandissons ensemble. C&apos;est d&apos;ailleurs le but de ce portfolio et de mes write-ups. Sur le terrain, je me concentre principalement sur les langages bas niveau comme le C et l&apos;Assembleur.
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-12">
                  <div>
                    <h4 className="font-mono text-xs uppercase text-primary mb-6 tracking-widest font-bold">Expertise Technique</h4>
                    <ul className="space-y-3 text-sm text-on-surface-variant">
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Exploitation Bas Niveau (C, ASM)</span></li>
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Tests d&apos;Intrusion &amp; Red Teaming</span></li>
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Recherche de Vulnérabilités</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase text-secondary mb-6 tracking-widest font-bold">Formation &amp; Rangs</h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">HackTheBox</span>
                        <span className="font-mono text-xs text-secondary">Elite Hacker</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">TryHackMe</span>
                        <span className="font-mono text-xs text-secondary">Guru (Certifié PT1)</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">École 42</span>
                        <span className="font-mono text-xs text-on-surface-variant/60">Alumni</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase text-primary mb-6 tracking-widest font-bold">Historique Opérationnel</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface">CEO @ PrismaSec</span>
                      <span className="font-mono text-xs text-on-surface-variant/60">2025-Présent</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface">Fondateur @ Lost in the shell</span>
                      <span className="font-mono text-xs text-on-surface-variant/60">2022-2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-y border-outline-variant/10">
        <div className="page-frame">
          <div className="mb-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-widest text-on-surface flex items-center gap-4">
              <span className="text-secondary">[</span> CAPACITÉS_CLÉS <span className="text-secondary">]</span>
            </h2>
          </div>

          <div className="mb-20">
            <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary"></span>
              SÉCURITÉ OFFENSIVE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityCard icon={<Globe className="w-8 h-8 text-primary" />} title="WEB APP" desc="Top 10 OWASP, Contournement d'Auth, SQLi, XSS, Failles Logiques" borderColor="border-primary/30" />
              <CapabilityCard icon={<Network className="w-8 h-8 text-secondary" />} title="RÉSEAU" desc="Pentest, Pivoting, Exploitation AD, MiTM" borderColor="border-secondary/30" />
              <CapabilityCard icon={<Code className="w-8 h-8 text-primary" />} title="API" desc="REST/GraphQL, BOLA, Assignation de Masse, Rate Limiting" borderColor="border-primary/30" />
              <CapabilityCard icon={<Cloud className="w-8 h-8 text-secondary" />} title="CLOUD" desc="AWS, Azure, Mauvaises Configs IAM, Exposition S3, K8s" borderColor="border-secondary/30" />
            </div>
          </div>

          <div>
            <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-secondary mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-secondary"></span>
              DÉVELOPPEMENT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityCard icon={<Cpu className="w-8 h-8 text-primary" />} title="KERNEL" desc="C, Programmation Bas Niveau, Drivers Kernel, Gestion Mémoire" borderColor="border-primary/30" />
              <CapabilityCard icon={<ShieldAlert className="w-8 h-8 text-secondary" />} title="MALWARE" desc="Rétro-ingénierie, Obfuscation, Anti-AV, Analyse" borderColor="border-secondary/30" />
              <CapabilityCard icon={<Terminal className="w-8 h-8 text-primary" />} title="OUTILS OFFENSIFS" desc="Python, Automatisation, Outils Sur Mesure, Frameworks d'Exploitation" borderColor="border-primary/30" />
              <CapabilityCard icon={<GraduationCap className="w-8 h-8 text-secondary" />} title="CHALLENGES PÉDAGOGIQUES" desc="Création de CTF, Formation, Ateliers Sécurité, Mentorat" borderColor="border-secondary/30" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-32 flex flex-col items-center text-center overflow-hidden relative border-t border-outline-variant/10">
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 hero-frame">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight text-on-surface">
              PRÊT À RENFORCER <br /> VOTRE POSTURE ?
            </h2>
            <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto font-light">
              N&apos;attendez pas qu&apos;une brèche se produise. Trouvons les failles de votre sécurité avant que les acteurs malveillants ne le fassent.
            </p>
            <div className="bg-surface-container p-1 inline-flex flex-col sm:flex-row items-center gap-4 border border-outline-variant/20">
              <span className="font-mono text-sm text-primary px-6 py-3">contact@rstride.fr</span>
              <Link href="/contact" className="bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all hover:bg-primary-dim active:scale-95 w-full sm:w-auto">
                CONTACTEZ-MOI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function CapabilityCard({ icon, title, desc, borderColor }: { icon: React.ReactNode, title: string, desc: string, borderColor: string }) {
  return (
    <div className={`bg-surface-container-highest p-8 aspect-square flex flex-col justify-between hover:bg-surface-container transition-colors duration-300 border-b-4 ${borderColor}`}>
      <div className="mb-6">{icon}</div>
      <div>
        <h4 className="font-headline text-xl font-bold uppercase mb-3 text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant font-mono leading-relaxed opacity-80">{desc}</p>
      </div>
    </div>
  );
}
