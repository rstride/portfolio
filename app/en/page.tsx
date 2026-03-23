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

            <div className="xl:col-span-5 2xl:col-span-4">
              <div className="hero-panel bg-surface-container-low border border-outline-variant/20 p-8 2xl:p-10 frame-stack">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-secondary to-transparent"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5 relative z-10">
                  <div className="bg-surface-container-highest/80 border border-outline-variant/20 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">OPERATIONAL_FOCUS</div>
                    <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                      Offensive security for web, APIs, and infrastructure with a strong low-level exploitation bias.
                    </p>
                  </div>
                  <div className="bg-surface-container-highest/80 border border-outline-variant/20 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary mb-3">ACTIVE_STACK</div>
                    <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase text-on-surface-variant">
                      <span className="border border-outline-variant/20 px-2 py-1">C/ASM</span>
                      <span className="border border-outline-variant/20 px-2 py-1">WEB</span>
                      <span className="border border-outline-variant/20 px-2 py-1">AD</span>
                      <span className="border border-outline-variant/20 px-2 py-1">CLOUD</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-highest/80 border border-outline-variant/20 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-3">SESSION_STATE</div>
                    <div className="space-y-2 font-mono text-xs uppercase">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant/60">status</span>
                        <span className="text-primary">operational</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant/60">scope</span>
                        <span className="text-on-surface">freelance / lead</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant/60">response</span>
                        <span className="text-secondary">&lt; 24h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24 border-y border-outline-variant/10">
        <div className="page-frame">
          <div className="mb-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-widest text-on-surface flex items-center gap-4">
              <span className="text-secondary">[</span> CORE_CAPABILITIES <span className="text-secondary">]</span>
            </h2>
          </div>

          <div className="mb-20">
            <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-primary mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary"></span>
              OFFENSIVE SECURITY
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityCard icon={<Globe className="w-8 h-8 text-primary" />} title="WEB APP" desc="OWASP Top 10, Auth Bypass, SQLi, XSS, Logic Flaws" borderColor="border-primary/30" />
              <CapabilityCard icon={<Network className="w-8 h-8 text-secondary" />} title="NETWORK" desc="Pentest, Pivoting, AD Exploitation, MiTM" borderColor="border-secondary/30" />
              <CapabilityCard icon={<Code className="w-8 h-8 text-primary" />} title="API" desc="REST/GraphQL, BOLA, Mass Assignment, Rate Limiting" borderColor="border-primary/30" />
              <CapabilityCard icon={<Cloud className="w-8 h-8 text-secondary" />} title="CLOUD" desc="AWS, Azure, IAM Misconfigs, S3 Exposure, K8s" borderColor="border-secondary/30" />
            </div>
          </div>

          <div>
            <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-secondary mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-secondary"></span>
              DEVELOPMENT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityCard icon={<Cpu className="w-8 h-8 text-primary" />} title="KERNEL" desc="C, Low-level Programming, Kernel Drivers, Memory Management" borderColor="border-primary/30" />
              <CapabilityCard icon={<ShieldAlert className="w-8 h-8 text-secondary" />} title="MALWARE" desc="Reverse Engineering, Obfuscation, Anti-AV, Analysis" borderColor="border-secondary/30" />
              <CapabilityCard icon={<Terminal className="w-8 h-8 text-primary" />} title="OFFENSIVE TOOLS" desc="Python, Automation, Custom Tooling, Exploitation Frameworks" borderColor="border-primary/30" />
              <CapabilityCard icon={<GraduationCap className="w-8 h-8 text-secondary" />} title="EDUCATIONAL CHALLENGES" desc="CTF Creation, Training, Security Workshops, Mentorship" borderColor="border-secondary/30" />
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
                        <span className="font-mono text-xs text-on-surface-variant/60">Alumni</span>
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
