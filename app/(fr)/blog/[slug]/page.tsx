import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as motion from 'motion/react-client';
import { getBlogPostBySlug, getBlogPosts, markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { StructuredData } from '@/components/structured-data';
import { articleJsonLd, breadcrumbJsonLd, buildArticleMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getBlogPosts('fr').map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug, 'fr');

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return buildArticleMetadata({
    locale: 'fr',
    post: { slug: post.slug, ...post.meta },
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug, 'fr');

  if (!post) {
    notFound();
  }

  const html = await markdownToHtml(post.content);
  const postMeta = { slug: post.slug, ...post.meta };
  const badgeValue = (post.meta.difficulty || post.meta.severity || '').toUpperCase();
  const isCriticalLike = badgeValue === 'CRITICAL' || badgeValue === 'HARD' || badgeValue === 'INSANE';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="reading-frame frame-stack py-12 xl:py-16"
    >
      <StructuredData data={articleJsonLd(postMeta, 'fr')} />
      <StructuredData
        data={breadcrumbJsonLd('fr', [
          { name: 'Accueil', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.meta.title, path: `/blog/${post.slug}` },
        ])}
      />
      <div className="reading-column">
        <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors mb-12 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          RETOUR_AUX_LOGS
        </Link>

        <article>
        <header className="mb-16 border-b border-outline-variant/20 pb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="font-mono text-xs text-primary bg-primary/10 px-3 py-1.5 border border-primary/20">
              {post.meta.id}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              DATE: {post.meta.date}
            </span>
            <span className={`font-mono text-xs px-3 py-1.5 border ${isCriticalLike ? 'text-error border-error/30 bg-error/10' : 'text-error/80 border-error/20'}`}>
              DIFFICULTY: {badgeValue}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              AUTHOR: {post.meta.author}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter leading-tight mb-8">
            {post.meta.title.toUpperCase()}
          </h1>
          
          <div className="flex flex-wrap gap-3">
            {post.meta.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-on-surface-variant/80 uppercase bg-surface-container px-3 py-1 border border-outline-variant/20">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="article-intro-rail mb-10">
          <span className="article-intro-kicker">DOSSIER_TECHNIQUE</span>
          <span className="article-intro-line"></span>
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mt-24 pt-12 border-t border-outline-variant/20">
          <div className="bg-surface-container-low p-8 border-l-4 border-primary flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-surface-container-highest border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-headline font-bold text-xl text-primary">0x</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg text-on-surface mb-2">À PROPOS DE L&apos;AUTEUR</h4>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Romain Stride (0x7E3) est un chercheur senior en sécurité spécialisé dans la sécurité des applications web et le développement d&apos;exploits. Quand il ne casse pas des choses, il construit des architectures sécurisées.
              </p>
            </div>
          </div>
          <div className="mt-8 bg-surface-container p-8 border border-outline-variant/20">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-secondary">
              Prochaine étape
            </span>
            <h3 className="mt-4 font-headline text-3xl font-bold uppercase text-on-surface">
              Besoin d&apos;évaluer une surface similaire ?
            </h3>
            <p className="mt-4 text-sm text-on-surface-variant font-light leading-relaxed max-w-2xl">
              Décrivez le périmètre et les contraintes pour cadrer un audit applicatif, API ou cloud.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?source=blog_article&topic=${post.slug}`}
                className="bg-primary text-on-primary font-mono text-xs font-bold uppercase px-6 py-3 transition-all terminal-glow active:scale-95 text-center"
              >
                Demander un cadrage
              </Link>
              <Link
                href="/services"
                className="border border-outline-variant/30 text-primary font-mono text-xs font-bold uppercase px-6 py-3 hover:bg-surface-container-highest transition-all active:scale-95 text-center"
              >
                Voir les services
              </Link>
            </div>
          </div>
        </footer>
        </article>
      </div>
    </motion.div>
  );
}
