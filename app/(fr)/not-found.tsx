import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  const copy = {
    label: 'Erreur 404 // Page introuvable',
    title: 'PAGE INTROUVABLE',
    body: 'La page demandée n’existe pas ou a été déplacée. Revenez à l’accueil ou contactez-moi si vous cherchiez une ressource précise.',
    primary: 'Retour à l’accueil',
    primaryHref: '/',
    secondary: 'Contact',
    secondaryHref: '/contact?source=404',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-error/20 blur-xl rounded-full"></div>
        <Terminal className="w-24 h-24 text-error relative z-10" />
      </div>
      
      <span className="font-mono text-error uppercase tracking-[0.3em] text-sm mb-4 block">
        {copy.label}
      </span>
      
      <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-6">
        {copy.title}
      </h1>
      
      <p className="text-on-surface-variant text-lg leading-relaxed font-light mb-12 max-w-md mx-auto">
        {copy.body}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={copy.primaryHref}
          className="bg-primary text-on-primary font-mono text-sm font-bold uppercase px-8 py-4 transition-all terminal-glow active:scale-95 inline-block"
        >
          {copy.primary}
        </Link>
        <Link
          href={copy.secondaryHref}
          className="bg-surface-container border border-outline-variant/30 text-on-surface font-mono text-sm font-bold uppercase px-8 py-4 hover:bg-surface-container-highest hover:border-primary/50 hover:text-primary transition-all active:scale-95 inline-block"
        >
          {copy.secondary}
        </Link>
      </div>
    </div>
  );
}
