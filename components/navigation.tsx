'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const hasOpenedMobileMenuRef = useRef(false);
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');

  const navItems = isEnglish ? [
    { name: 'HOME', path: '/en' },
    { name: 'SERVICES', path: '/en/services' },
    { name: 'ARTICLES', path: '/en/blog' },
    { name: 'CONTACT', path: '/en/contact' },
  ] : [
    { name: 'ACCUEIL', path: '/' },
    { name: 'SERVICES', path: '/services' },
    { name: 'ARTICLES', path: '/blog' },
    { name: 'CONTACT', path: '/contact' },
  ];
  const primaryCta = isEnglish
    ? { label: 'Request an audit', path: '/en/contact?source=nav_cta' }
    : { label: 'Demander un audit', path: '/contact?source=nav_cta' };
  const languageToggleLabel = isEnglish ? 'Passer en français' : 'Switch to English';

  const toggleLanguage = () => {
    setIsMobileMenuOpen(false);
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

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      if (hasOpenedMobileMenuRef.current) {
        menuButtonRef.current?.focus();
        hasOpenedMobileMenuRef.current = false;
      }
      return;
    }

    hasOpenedMobileMenuRef.current = true;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const getFocusableElements = () => {
      const overlay = mobileOverlayRef.current;

      if (!overlay) {
        return [];
      }

      return Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 z-50 bg-[#0c0e12]/90 backdrop-blur-md border-b border-outline-variant/20 w-full py-4">
        <div className="chrome-frame flex justify-between items-center gap-6">
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
                  aria-current={isActive ? 'page' : undefined}
                  className={`transition-colors duration-300 ${
                    isActive 
                      ? 'text-primary font-black border-b-2 border-primary pb-1' 
                      : 'text-on-surface/60 hover:text-primary focus-visible:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={primaryCta.path}
              className="cta-primary hidden md:inline-flex text-xs tracking-[0.16em] px-5 py-3"
            >
              {primaryCta.label}
            </Link>
            <button 
              onClick={toggleLanguage}
              className="min-h-11 p-2 text-on-surface/60 hover:text-primary focus-visible:text-primary hover:bg-surface-container transition-all duration-300 active:scale-90 flex items-center gap-2"
              title={languageToggleLabel}
              aria-label={languageToggleLabel}
            >
              <Globe className="w-5 h-5" />
              <span className="font-mono text-xs font-bold">{isEnglish ? 'EN' : 'FR'}</span>
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-overlay"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden min-h-11 p-2 text-on-surface/60 hover:text-primary focus-visible:text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div
          ref={mobileOverlayRef}
          id="mobile-navigation-overlay"
          className="mobile-nav-overlay md:hidden"
        >
          <div className="mobile-nav-grid"></div>
          <div className="mobile-nav-shell chrome-frame">
            <div className="mobile-nav-header">
              <Link
                href={isEnglish ? '/en' : '/'}
                className="text-xl font-bold tracking-tighter text-primary font-headline uppercase"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ROMAIN_STRIDE //
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-nav-close"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mobile-nav-body">
              <div className="mobile-nav-rail">
                <span className="mobile-nav-kicker">{isEnglish ? 'Navigation // Mobile Access' : 'Navigation // Accès Mobile'}</span>
                <span className="mobile-nav-line"></span>
              </div>

              <Link
                href={primaryCta.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-nav-cta"
              >
                {primaryCta.label}
              </Link>

              <div className="mobile-nav-links">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path || (item.path !== '/' && item.path !== '/en' && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                    >
                      <span className="mobile-nav-link-index">
                        {String(index).padStart(2, '0')}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={toggleLanguage}
                className="mobile-nav-language"
                title={languageToggleLabel}
                aria-label={languageToggleLabel}
              >
                <Globe className="w-5 h-5" />
                <span>{isEnglish ? 'Switch to French' : 'Basculer en anglais'}</span>
                <span className="mobile-nav-language-code">{isEnglish ? 'FR' : 'EN'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
