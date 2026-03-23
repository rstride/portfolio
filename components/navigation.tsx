'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Menu } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isEnglish = pathname.startsWith('/en');

  const navItems = isEnglish ? [
    { name: 'ROOT', path: '/en' },
    { name: 'SERVICES', path: '/en/services' },
    { name: 'BLOG', path: '/en/blog' },
    { name: 'CONTACT', path: '/en/contact' },
  ] : [
    { name: 'ROOT', path: '/' },
    { name: 'SERVICES', path: '/services' },
    { name: 'BLOG', path: '/blog' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const toggleLanguage = () => {
    if (isEnglish) {
      // Switch to French
      const newPath = pathname.replace(/^\/en/, '') || '/';
      router.push(newPath);
    } else {
      // Switch to English
      const newPath = pathname === '/' ? '/en' : `/en${pathname}`;
      router.push(newPath);
    }
  };

  return (
    <nav className="fixed top-0 z-50 bg-[#0c0e12]/90 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center w-full px-6 md:px-8 py-4">
      <Link href={isEnglish ? "/en" : "/"} className="text-xl font-bold tracking-tighter text-primary font-headline uppercase">
        ROMAIN_STRIDE //
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-headline uppercase tracking-widest text-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && item.path !== '/en' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`transition-colors duration-300 ${
                isActive 
                  ? 'text-primary font-black border-b-2 border-primary pb-1' 
                  : 'text-on-surface/60 hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="p-2 text-on-surface/60 hover:text-primary hover:bg-surface-container transition-all duration-300 active:scale-90 flex items-center gap-2"
          title={isEnglish ? "Passer en Français" : "Switch to English"}
        >
          <Globe className="w-5 h-5" />
          <span className="font-mono text-xs font-bold">{isEnglish ? 'EN' : 'FR'}</span>
        </button>
        <button className="md:hidden p-2 text-on-surface/60 hover:text-primary">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
