import Image from 'next/image';
import Link from 'next/link';
import { Globe, Network, Code, Cloud, Cpu, ShieldAlert, Terminal, GraduationCap } from 'lucide-react';
import * as motion from 'motion/react-client';

type CapabilityTone = 'primary' | 'secondary';
type CapabilitySize = 'featured' | 'standard' | 'compact';

type Capability = {
  title: string;
  description: string;
  eyebrow: string;
  status: string;
  icon: React.ReactNode;
  tone: CapabilityTone;
  size: CapabilitySize;
  tags?: string[];
  meta?: string[];
};

const offensiveCapabilities: Capability[] = [
  {
    title: 'WEB APP',
    description: 'OWASP Top 10, Auth Bypass, SQLi, XSS, Logic Flaws',
    eyebrow: 'Vector // Primary Surface',
    status: 'high signal',
    icon: <Globe className="w-7 h-7" />,
    tone: 'primary',
    size: 'featured',
    tags: ['OWASP', 'AUTH', 'LOGIC'],
    meta: ['Business logic review', 'Auth/session tests', 'Controlled exploitation'],
  },
  {
    title: 'NETWORK',
    description: 'Pentest, Pivoting, AD Exploitation, MiTM',
    eyebrow: 'Lateral // Internal Scope',
    status: 'active',
    icon: <Network className="w-6 h-6" />,
    tone: 'secondary',
    size: 'compact',
    tags: ['AD', 'MITM'],
  },
  {
    title: 'API',
    description: 'REST/GraphQL, BOLA, Mass Assignment, Rate Limiting',
    eyebrow: 'Protocol // High Exposure',
    status: 'priority',
    icon: <Code className="w-7 h-7" />,
    tone: 'primary',
    size: 'standard',
    tags: ['REST', 'BOLA', 'GRAPHQL'],
    meta: ['Object access control', 'Business abuse testing'],
  },
  {
    title: 'CLOUD',
    description: 'AWS, Azure, IAM Misconfigs, S3 Exposure, K8s',
    eyebrow: 'Infra // Shared Responsibility',
    status: 'mapped',
    icon: <Cloud className="w-6 h-6" />,
    tone: 'secondary',
    size: 'compact',
    tags: ['IAM', 'S3', 'K8S'],
  },
];

const developmentCapabilities: Capability[] = [
  {
    title: 'KERNEL',
    description: 'C, Low-level Programming, Kernel Drivers, Memory Management',
    eyebrow: 'Runtime // Low Level',
    status: 'deep dive',
    icon: <Cpu className="w-7 h-7" />,
    tone: 'primary',
    size: 'standard',
    tags: ['C', 'ASM', 'MEM'],
    meta: ['System internals', 'Memory-oriented analysis'],
  },
  {
    title: 'MALWARE',
    description: 'Reverse Engineering, Obfuscation, Anti-AV, Analysis',
    eyebrow: 'Analysis // Reverse',
    status: 'tracked',
    icon: <ShieldAlert className="w-6 h-6" />,
    tone: 'secondary',
    size: 'compact',
    tags: ['RE', 'EVADE'],
  },
  {
    title: 'OFFENSIVE TOOLS',
    description: 'Python, Automation, Custom Tooling, Exploitation Frameworks',
    eyebrow: 'Tooling // Field Ready',
    status: 'featured',
    icon: <Terminal className="w-7 h-7" />,
    tone: 'primary',
    size: 'featured',
    tags: ['PYTHON', 'OPS', 'CUSTOM'],
    meta: ['Offensive automation', 'Exploit chains', 'Custom tooling'],
  },
  {
    title: 'EDUCATIONAL CHALLENGES',
    description: 'CTF Creation, Training, Security Workshops, Mentorship',
    eyebrow: 'Training // Knowledge Transfer',
    status: 'live',
    icon: <GraduationCap className="w-6 h-6" />,
    tone: 'secondary',
    size: 'compact',
    tags: ['CTF', 'WORKSHOP'],
  },
];

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
                PENTESTER <span className="text-secondary">&amp;</span> SECURITY <br /> DEVELOPER
              </h1>

              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mb-12 font-light">
                Freelance pentester and École 42 alumni, specializing in vulnerability research and low-level exploitation. With strong expertise in C and Assembly, I dissect systems to understand their core flaws.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/en/contact" className="bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all terminal-glow active:scale-95 inline-block">
                  INITIATE ENGAGEMENT
                </Link>
                <Link href="/en/services" className="border border-outline-variant/30 text-primary font-mono text-sm font-bold uppercase px-8 py-4 hover:bg-surface-container transition-all active:scale-95 inline-block">
                  VIEW CAPABILITIES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-28 border-y border-outline-variant/10">
        <div className="page-frame">
          <div className="mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-widest text-on-surface flex items-center gap-4">
              <span className="text-secondary">[</span> CORE_CAPABILITIES <span className="text-secondary">]</span>
            </h2>
          </div>

          <CapabilityRow title="OFFENSIVE SECURITY" tone="primary" items={offensiveCapabilities} />
          <CapabilityRow title="DEVELOPMENT" tone="secondary" items={developmentCapabilities} />
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="page-frame">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 relative">
              <div className="mx-auto max-w-[14rem] sm:max-w-xs md:max-w-sm lg:max-w-sm aspect-[4/5] sm:aspect-[3/4] bg-surface-container-highest border border-outline-variant/20 relative p-2">
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10"></div>
                <div className="w-full h-full border border-primary/10 relative overflow-hidden contrast-125 opacity-80">
                  <Image
                    src="/rstride.jpg"
                    alt="Operator Profile"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-3 right-3 sm:-bottom-4 sm:-right-4 bg-primary text-on-primary px-3 py-2 sm:p-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold z-20 shadow-lg">
                  OPERATOR_ID: 0x7CC
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-secondary"></div>
                <span className="font-mono text-xs uppercase text-secondary tracking-widest">About the operator</span>
              </div>

              <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase mb-10 leading-tight text-on-surface">
                OFFENSIVE OPERATIONS <br /> PHILOSOPHY
              </h2>

              <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg font-light">
                <p>
                  I am a freelance pentester passionate about offensive security and reverse engineering. Trained at École 42, I forged my technical skills through intensive hands-on practice and <span className="text-primary italic font-normal">peer-to-peer learning</span>.
                </p>
                <p>
                  My approach to cybersecurity is rooted in knowledge sharing: I firmly believe that collaborating and documenting our findings is how we grow together. That is the very purpose of this portfolio and my write-ups. In the field, I focus heavily on low-level languages like C and Assembly.
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-12">
                  <div>
                    <h4 className="font-mono text-xs uppercase text-primary mb-6 tracking-widest font-bold">Technical Expertise</h4>
                    <ul className="space-y-3 text-sm text-on-surface-variant">
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Low-Level Exploitation (C, ASM)</span></li>
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Penetration Testing &amp; Red Teaming</span></li>
                      <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></span><span>Vulnerability Research</span></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase text-secondary mb-6 tracking-widest font-bold">Training &amp; Ranks</h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">HackTheBox</span>
                        <span className="font-mono text-xs text-secondary">Elite Hacker</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">TryHackMe</span>
                        <span className="font-mono text-xs text-secondary">Guru (PT1 Certified)</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                        <span className="text-on-surface">École 42</span>
                        <span className="font-mono text-xs text-secondary">Alumni</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase text-primary mb-6 tracking-widest font-bold">Operational History</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface">CEO @ PrismaSec</span>
                      <span className="font-mono text-xs text-on-surface-variant/60">2025-Present</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface">Founder @ Lost in the shell</span>
                      <span className="font-mono text-xs text-on-surface-variant/60">2022-2024</span>
                    </div>
                  </div>
                </div>
              </div>
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
              READY TO STRENGTHEN <br /> YOUR POSTURE?
            </h2>
            <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto font-light">
              Don&apos;t wait for a breach to happen. Let&apos;s find the holes in your security before the threat actors do.
            </p>
            <div className="bg-surface-container p-1 inline-flex flex-col sm:flex-row items-center gap-4 border border-outline-variant/20">
              <span className="font-mono text-sm text-primary px-6 py-3">contact@rstride.fr</span>
              <Link href="/en/contact" className="bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all hover:bg-primary-dim active:scale-95 w-full sm:w-auto">
                CONTACT ME
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function CapabilityRow({ title, tone, items }: { title: string; tone: CapabilityTone; items: Capability[] }) {
  return (
    <div className="mb-14 last:mb-0">
      <div className="capability-row-header">
        <span className={`capability-row-line ${tone === 'primary' ? 'capability-row-line-primary' : 'capability-row-line-secondary'}`}></span>
        <h3 className={`font-headline text-xl font-bold uppercase tracking-widest ${tone === 'primary' ? 'text-primary' : 'text-secondary'}`}>
          {title}
        </h3>
      </div>

      <div className="capability-grid">
        {items.map((item) => (
          <CapabilityCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

function CapabilityCard({ item }: { item: Capability }) {
  const toneClass = item.tone === 'primary' ? 'capability-card-primary' : 'capability-card-secondary';
  const sizeClass =
    item.size === 'featured'
      ? 'capability-card-featured'
      : item.size === 'standard'
        ? 'capability-card-standard'
        : 'capability-card-compact';

  return (
    <article className={`capability-card ${toneClass} ${sizeClass}`}>
      <div className="capability-card-beam"></div>
      <div className="capability-card-scan"></div>

      <div className="capability-card-head">
        <div className="capability-card-icon">{item.icon}</div>
        <div className="capability-card-status">
          <span className="capability-card-eyebrow">{item.eyebrow}</span>
          <span className="capability-card-state">{item.status}</span>
        </div>
      </div>

      <div className="capability-card-body">
        <h4 className="font-headline text-2xl font-bold uppercase text-on-surface">{item.title}</h4>
        <p className="text-xs text-on-surface-variant font-mono leading-relaxed opacity-85">{item.description}</p>
      </div>

      {item.meta && (
        <div className="capability-card-meta">
          {item.meta.map((entry) => (
            <span key={entry}>{entry}</span>
          ))}
        </div>
      )}

      {item.tags && (
        <div className="capability-card-tags">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}
