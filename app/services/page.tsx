import Link from 'next/link';
import { ShieldAlert, GraduationCap, Globe, Network, Code, Cloud } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function ServicesPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-frame py-12 xl:py-16"
    >
      {/* Header Section */}
      <header className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
              Catalogue de Capacités // v2.4
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
              SERVICES .
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              Évaluation offensive de haut niveau et renforcement structurel des infrastructures critiques. Nous ne cochons pas de cases, nous identifions des vecteurs de compromission réels.
            </p>
          </div>
          <div className="hidden lg:block h-32 w-[1px] bg-outline-variant/30"></div>
          <div className="font-mono text-xs space-y-3 text-on-surface-variant/60 uppercase text-left md:text-right">
            <div>Status: <span className="text-primary font-bold">Operational</span></div>
            <div>Location: 127.0.0.1</div>
            <div>Uptime: 99.99%</div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 border-y border-outline-variant/20 py-16">
        <div className="flex flex-col justify-center">
          <h2 className="font-headline text-3xl font-bold mb-6 text-on-surface">NOTRE DOUBLE EXPERTISE</h2>
          <p className="text-on-surface-variant leading-relaxed font-light">
            CIPHER_ZERO opère à l&apos;intersection de l&apos;attaque et de l&apos;éducation. Nous croyons qu&apos;une défense efficace repose sur deux piliers : l&apos;identification rigoureuse des failles par nos <strong className="text-on-surface font-medium">audits offensifs</strong> et la montée en compétence continue par nos <strong className="text-on-surface font-medium">formations spécialisées</strong>.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface-container p-8 border-l-2 border-primary hover:bg-surface-container-high transition-colors">
            <ShieldAlert className="w-8 h-8 text-primary mb-4" />
            <div className="font-mono text-[10px] uppercase text-primary mb-2 tracking-widest">Offensif</div>
            <div className="text-base font-bold font-headline">Pentesting &amp; Red Team</div>
          </div>
          <div className="bg-surface-container p-8 border-l-2 border-secondary hover:bg-surface-container-high transition-colors">
            <GraduationCap className="w-8 h-8 text-secondary mb-4" />
            <div className="font-mono text-[10px] uppercase text-secondary mb-2 tracking-widest">Éducatif</div>
            <div className="text-base font-bold font-headline">Training &amp; CTF</div>
          </div>
        </div>
      </section>

      {/* Section 1: Audits & Pentests */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-2xl font-headline font-bold uppercase tracking-widest text-on-surface">01. Audits &amp; Pentests</h2>
          <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Web Audit */}
          <div className="md:col-span-8 bg-surface-container p-10 relative group overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-32 h-32 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-6 text-primary relative z-10">Applications Web</h3>
            <p className="text-on-surface-variant mb-10 max-w-xl font-light relative z-10">
              Analyse approfondie des vulnérabilités OWASP Top 10, logique métier complexe et failles d&apos;authentification. Nous testons vos APIs et front-ends comme le ferait un attaquant motivé.
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">OWASP</span>
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">SQLi/XSS</span>
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">Logic Exploit</span>
            </div>
          </div>

          {/* Cloud Audit */}
          <div className="md:col-span-4 bg-surface-container-low p-10 border-l-4 border-secondary/40 hover:bg-surface-container transition-colors">
            <h3 className="text-xl font-headline font-bold mb-6 text-secondary">Cloud Architecture</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 font-light">
              Audit des configurations AWS, Azure et GCP. Focus sur les permissions IAM excessives, le stockage non sécurisé et la segmentation réseau.
            </p>
            <ul className="space-y-4 font-mono text-[10px] uppercase text-on-surface/80">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-secondary"></span> AWS Pentesting</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-secondary"></span> Azure Security</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-secondary"></span> Kubernetes Hardening</li>
            </ul>
          </div>

          {/* Infra Audit */}
          <div className="md:col-span-4 bg-surface-container-high p-10 border border-outline-variant/10 hover:border-tertiary/30 transition-colors">
            <h3 className="text-xl font-headline font-bold mb-6 text-tertiary">Infrastructure Interne</h3>
            <p className="text-sm text-on-surface-variant mb-10 font-light">
              Mise en situation réelle après intrusion périmétrique. Analyse de l&apos;Active Directory, pivots réseau et escalade de privilèges.
            </p>
            <div className="mt-auto pt-8">
              <div className="w-full h-1 bg-outline-variant/20 relative">
                <div className="absolute top-0 left-0 h-full w-[85%] bg-tertiary"></div>
              </div>
            </div>
          </div>

          {/* Process Details */}
          <div className="md:col-span-8 bg-surface-container p-10 border border-outline-variant/10">
            <h3 className="text-xl font-headline font-bold mb-10 uppercase tracking-widest text-on-surface">Le Processus Opérationnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">01/ RECON</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">Collecte d&apos;OSINT, cartographie de la surface d&apos;attaque et identification des points d&apos;entrée.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">02/ EXPLOIT</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">Tentatives d&apos;intrusion contrôlées pour confirmer l&apos;impact réel des vulnérabilités.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">03/ REPORTING</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">Rapport technique détaillé et restitution stratégique avec plan de remédiation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Formations */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-2xl font-headline font-bold uppercase tracking-widest text-on-surface">02. Formations</h2>
          <div className="flex-grow h-[1px] bg-outline-variant/20"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="text-4xl font-headline font-bold leading-tight mb-8 text-secondary uppercase">
                TRANSFÉRER <br />LE SAVOIR-FAIRE.
              </h3>
              <p className="text-on-surface-variant mb-10 font-light leading-relaxed">
                Des cursus conçus par des experts terrain pour élever le niveau de sécurité global de votre organisation. Théorie ciblée, pratique intensive.
              </p>
              <div className="p-8 bg-surface-container-highest/50 backdrop-blur-md border-t-2 border-secondary/40">
                <ShieldAlert className="w-6 h-6 text-secondary mb-6" />
                <p className="text-sm italic text-on-surface-variant leading-relaxed">
                  &quot;La sécurité n&apos;est pas un produit, c&apos;est un processus. Nous formons vos équipes à anticiper les menaces.&quot;
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-6">
            {/* Training Item 1 */}
            <div className="group bg-surface-container hover:bg-surface-container-high transition-all p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-r-4 border-transparent hover:border-secondary">
              <div className="flex-grow">
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Corporate Awareness</span>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">Sensibilisation à la Cybersécurité</h4>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">Pour les équipes non techniques : bonnes pratiques, hygiène numérique et prévention du phishing.</p>
              </div>
              <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">1 Journée / Interactif</span>
                <Link href="/contact" className="bg-secondary text-on-secondary px-8 py-3 font-mono text-xs uppercase font-bold terminal-glow transition-all w-full md:w-auto text-center">
                  Consulter
                </Link>
              </div>
            </div>

            {/* Training Item 2 */}
            <div className="group bg-surface-container hover:bg-surface-container-high transition-all p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-r-4 border-transparent hover:border-secondary">
              <div className="flex-grow">
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Advanced Technical</span>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">Formation Technique Expert</h4>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">Pour les profils techniques : exploitation avancée, secure coding et durcissement d&apos;infrastructure.</p>
              </div>
              <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">3-5 Jours / Hands-on Labs</span>
                <Link href="/contact" className="bg-secondary text-on-secondary px-8 py-3 font-mono text-xs uppercase font-bold terminal-glow transition-all w-full md:w-auto text-center">
                  Consulter
                </Link>
              </div>
            </div>

            {/* Training Item 3 */}
            <div className="group bg-surface-container hover:bg-surface-container-high transition-all p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-r-4 border-transparent hover:border-secondary">
              <div className="flex-grow">
                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Gamified Learning</span>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">Organisation de Challenges CTF</h4>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">Conception et hébergement d&apos;événements &quot;Capture The Flag&quot; sur mesure pour étudiants et professionnels.</p>
              </div>
              <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">Sur mesure / Compétition</span>
                <Link href="/contact" className="bg-secondary text-on-secondary px-8 py-3 font-mono text-xs uppercase font-bold terminal-glow transition-all w-full md:w-auto text-center">
                  Organiser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
