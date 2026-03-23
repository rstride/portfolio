'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');
  const privacyLink = isEnglish ? '/en/privacy' : '/privacy';

  return (
    <footer className="bg-[#0c0e12] w-full py-6 border-t border-outline-variant/20 relative z-10 mt-auto">
      <div className="chrome-frame flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-[10px] tracking-widest text-on-surface/40 uppercase">
          © 2026 ROOT_ACCESS_GRANTED. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-mono text-[10px] tracking-widest uppercase items-center">
          <a href="https://github.com/rstride" target="_blank" rel="noopener noreferrer" className="text-on-surface/40 hover:text-primary transition-colors">GITHUB</a>
          <a href="https://linkedin.com/in/romainstride" target="_blank" rel="noopener noreferrer" className="text-on-surface/40 hover:text-primary transition-colors">LINKEDIN</a>
          <a href={privacyLink} className="text-on-surface/40 hover:text-primary transition-colors">PRIVACY POLICY</a>
          <a href="https://prismasec.fr" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">SECURED_BY_PRISMASEC</a>
        </div>
      </div>
    </footer>
  );
}
