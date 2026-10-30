'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');
  const privacyLink = isEnglish ? '/en/privacy' : '/privacy';

  return (
    <footer className="bg-[#0c0e12] w-full py-6 border-t border-outline-variant/20 relative z-10 mt-auto">
      <div className="chrome-frame flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs tracking-widest text-on-surface-variant uppercase">
          © 2026 Romain Stride. {isEnglish ? 'All rights reserved.' : 'Tous droits réservés.'}
        </div>
        <div className="flex flex-wrap justify-center gap-5 md:gap-6 text-xs items-center text-on-surface-variant [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
          <a href="https://github.com/rstride" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/romainstride" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <Link href={isEnglish ? '/en/services' : '/services'} className="hover:text-primary transition-colors">Services</Link>
          <Link href={privacyLink} className="hover:text-primary transition-colors">
            {isEnglish ? 'PRIVACY POLICY' : 'POLITIQUE DE CONFIDENTIALITÉ'}
          </Link>
          <a href="https://prismasec.fr" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">PRISMASEC</a>
        </div>
      </div>
    </footer>
  );
}
