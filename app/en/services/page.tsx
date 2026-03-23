import Link from 'next/link';
import { ShieldAlert, Terminal, Network, Code, Server, Cpu, GraduationCap, Target } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function ServicesPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Header */}
      <section className="py-20 bg-surface-container-low border-b border-outline-variant/10">
        <div className="page-frame">
          <div className="max-w-5xl">
          <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
            Operational Capabilities // Services
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
            OFFENSIVE <br />
            <span className="text-secondary">SECURITY.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-light max-w-2xl">
            From targeted penetration testing to advanced security training. I provide actionable intelligence to secure your critical infrastructure.
          </p>
        </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24">
        <div className="page-frame grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="font-headline text-3xl font-bold mb-6 text-on-surface">OUR DUAL EXPERTISE</h2>
            <p className="text-on-surface-variant leading-relaxed font-light">
              CIPHER_ZERO operates at the intersection of attack and education. We believe effective defense relies on two pillars: rigorous vulnerability identification through our <strong className="text-on-surface font-medium">offensive audits</strong> and continuous skill building through our <strong className="text-on-surface font-medium">specialized training</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-surface-container p-8 border border-outline-variant/20 hover:border-primary/50 transition-colors">
              <Target className="w-8 h-8 text-primary mb-6" />
              <h3 className="font-headline font-bold text-xl mb-3 text-on-surface">AUDIT</h3>
              <p className="text-sm text-on-surface-variant font-light">Identify and exploit vulnerabilities before attackers do.</p>
            </div>
            <div className="bg-surface-container p-8 border border-outline-variant/20 hover:border-secondary/50 transition-colors">
              <GraduationCap className="w-8 h-8 text-secondary mb-6" />
              <h3 className="font-headline font-bold text-xl mb-3 text-on-surface">TRAINING</h3>
              <p className="text-sm text-on-surface-variant font-light">Elevate your teams&apos; technical skills to face modern threats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Audits Section */}
      <section className="py-24 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="page-frame">
        <div className="mb-16 flex items-center gap-4">
          <div className="h-[1px] w-16 bg-primary"></div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-widest text-on-surface">
            AUDITS &amp; PENTESTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Web App */}
          <div className="md:col-span-8 bg-surface-container-high p-10 border border-outline-variant/10 hover:border-primary/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code className="w-32 h-32 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-6 text-primary relative z-10">Web Applications</h3>
            <p className="text-on-surface-variant mb-10 max-w-xl font-light relative z-10">
              In-depth analysis of OWASP Top 10 vulnerabilities, complex business logic, and authentication flaws. We test your APIs and front-ends like a motivated attacker would.
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">OWASP</span>
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">API REST/GraphQL</span>
              <span className="bg-surface-container-highest px-4 py-1.5 font-mono text-[10px] uppercase border border-outline-variant/20 text-on-surface-variant">Logic Flaws</span>
            </div>
          </div>

          {/* Cloud */}
          <div className="md:col-span-4 bg-surface-container-high p-10 border border-outline-variant/10 hover:border-secondary/30 transition-colors">
            <h3 className="text-xl font-headline font-bold mb-6 text-secondary">Cloud &amp; DevOps</h3>
            <p className="text-sm text-on-surface-variant mb-10 font-light">
              Review of AWS/Azure architectures, IAM misconfigurations, container escapes (Docker/K8s), and CI/CD pipeline security.
            </p>
            <div className="mt-auto pt-8">
              <div className="w-full h-1 bg-outline-variant/20 relative">
                <div className="absolute top-0 left-0 h-full w-2/3 bg-secondary"></div>
              </div>
            </div>
          </div>

          {/* Infra */}
          <div className="md:col-span-4 bg-surface-container-high p-10 border border-outline-variant/10 hover:border-tertiary/30 transition-colors">
            <h3 className="text-xl font-headline font-bold mb-6 text-tertiary">Internal Infrastructure</h3>
            <p className="text-sm text-on-surface-variant mb-10 font-light">
              Real-world scenario after perimeter intrusion. Active Directory analysis, network pivoting, and privilege escalation.
            </p>
            <div className="mt-auto pt-8">
              <div className="w-full h-1 bg-outline-variant/20 relative">
                <div className="absolute top-0 left-0 h-full w-3/4 bg-tertiary"></div>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="md:col-span-8 bg-surface-container p-10 border border-outline-variant/20">
            <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface mb-8">OPERATIONAL_PROCESS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">01/ RECON</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">OSINT gathering, attack surface mapping, and entry point identification.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">02/ EXPLOIT</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">Controlled intrusion attempts to confirm the real impact of vulnerabilities.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-primary mb-3 font-bold">03/ REPORTING</div>
                <p className="text-xs text-on-surface-variant leading-relaxed">Detailed report with PoC, risk assessment, and actionable remediation recommendations.</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Formations Section */}
      <section className="py-24">
        <div className="page-frame">
        <div className="mb-16 flex items-center gap-4 justify-end">
          <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-widest text-on-surface">
            TRAINING &amp; WORKSHOPS
          </h2>
          <div className="h-[1px] w-16 bg-secondary"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <p className="text-on-surface-variant text-lg leading-relaxed font-light mb-8">
                Transferring offensive knowledge to strengthen defensive capabilities. Our training is designed by practitioners, for practitioners.
              </p>
              <div className="p-8 bg-surface-container-highest/50 backdrop-blur-md border-t-2 border-secondary/40">
                <ShieldAlert className="w-6 h-6 text-secondary mb-6" />
                <p className="text-sm italic text-on-surface-variant leading-relaxed">
                  &quot;Security is not a product, it&apos;s a process. We train your teams to anticipate threats.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Formation 1 */}
            <div className="bg-surface-container border border-outline-variant/20 p-8 md:p-10 hover:border-secondary/30 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Corporate Awareness</span>
                  <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">Security Awareness</h4>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">For non-technical teams: phishing, social engineering, and digital hygiene.</p>
                </div>
                <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                  <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">1/2 Day / Remote or On-site</span>
                  <Link href="/en/contact" className="font-mono text-xs text-secondary border border-secondary/30 px-6 py-3 hover:bg-secondary/10 transition-colors w-full md:w-auto text-center">
                    REQUEST QUOTE
                  </Link>
                </div>
              </div>
            </div>

            {/* Formation 2 */}
            <div className="bg-surface-container border border-outline-variant/20 p-8 md:p-10 hover:border-secondary/30 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Advanced Technical</span>
                  <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">Expert Technical Training</h4>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">For technical profiles: advanced exploitation, secure coding, and infrastructure hardening.</p>
                </div>
                <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                  <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">3-5 Days / Hands-on Labs</span>
                  <Link href="/en/contact" className="font-mono text-xs text-secondary border border-secondary/30 px-6 py-3 hover:bg-secondary/10 transition-colors w-full md:w-auto text-center">
                    REQUEST SYLLABUS
                  </Link>
                </div>
              </div>
            </div>

            {/* Formation 3 */}
            <div className="bg-surface-container border border-outline-variant/20 p-8 md:p-10 hover:border-secondary/30 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-grow">
                  <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-3 block">Gamified Learning</span>
                  <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">CTF Challenge Organization</h4>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed">Design and hosting of custom &quot;Capture The Flag&quot; events for students and professionals.</p>
                </div>
                <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto mt-6 md:mt-0">
                  <span className="text-[10px] font-mono text-on-surface/50 mb-4 uppercase tracking-widest">Custom / Competition</span>
                  <Link href="/en/contact" className="font-mono text-xs text-secondary border border-secondary/30 px-6 py-3 hover:bg-secondary/10 transition-colors w-full md:w-auto text-center">
                    DISCUSS PROJECT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </motion.div>
  );
}
