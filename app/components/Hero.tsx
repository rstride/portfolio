// app/components/Hero.tsx
'use client';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center"
    >
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-5">Welcome to My Portfolio</h1>
        <p className="text-xl md:text-2xl mb-10">Cybersecurity Specialist & Developer</p>
        <button
          onClick={() =>
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <ChevronDoubleDownIcon className="w-10 h-10 text-custom-green animate-bounce mx-auto" />
        </button>
      </div>
    </section>
  );
}
