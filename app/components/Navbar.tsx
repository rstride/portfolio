// app/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { text: 'About Me', sectionId: 'about' },
  { text: 'Projects', sectionId: 'projects' },
  { text: 'Skills', sectionId: 'skills' },
  { text: 'Contact', sectionId: 'contact' },
];

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'hero';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (sectionId: string) => {
    setNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-900">
      <div className="container mx-auto flex items-center justify-between p-5">
        <button
          onClick={() => handleNavLinkClick('hero')}
          className="text-2xl font-bold text-custom-green"
        >
          rstride
        </button>
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.sectionId}
              text={item.text}
              isActive={activeSection === item.sectionId}
              onClick={() => handleNavLinkClick(item.sectionId)}
            />
          ))}
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
          {navItems.map((item) => (
            <NavLink
              key={item.sectionId}
              text={item.text}
              isActive={activeSection === item.sectionId}
              onClick={() => handleNavLinkClick(item.sectionId)}
            />
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({
  text,
  isActive,
  onClick,
}: {
  text: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${
        isActive ? 'text-custom-green' : 'text-white'
      } hover:text-custom-green transition-colors duration-300 block px-5 py-3`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
