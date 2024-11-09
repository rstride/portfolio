// app/page.tsx
import Image from 'next/image';

export default function Home() {
  return (
    <main className="pt-16">
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center"
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-5">Welcome to My Portfolio</h1>
          <p className="text-xl md:text-2xl mb-10">Cybersecurity Specialist & Developer</p>
        </div>
      </section>
    </main>
  );
}
