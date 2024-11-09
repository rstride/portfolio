// app/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-5">
        <Link href="/">
          <a className="text-2xl font-bold text-green-500">rstride</a>
        </Link>
        <div className="hidden md:flex space-x-8">
          <NavLink href="/about" text="About Me" />
          <NavLink href="/projects" text="Projects" />
          <NavLink href="/skills" text="Skills" />
          <NavLink href="/contact" text="Contact" />
        </div>
        <div className="md:hidden">
          <button onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="md:hidden bg-gray-900">
          <NavLink href="/about" text="About Me" />
          <NavLink href="/projects" text="Projects" />
          <NavLink href="/skills" text="Skills" />
          <NavLink href="/contact" text="Contact" />
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href}>
      <a className="text-white hover:text-green-500 transition-colors duration-300 block px-5 py-3">
        {text}
      </a>
    </Link>
  );
}
