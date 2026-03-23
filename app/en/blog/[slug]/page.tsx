import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { getBlogPostBySlug, markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug, 'en');

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.meta.title} // Romain Stride`,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: 'article',
      url: `https://rstride.fr/en/blog/${post.slug}`,
      authors: [post.meta.author],
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.excerpt,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug, 'en');

  if (!post) {
    notFound();
  }

  const html = await markdownToHtml(post.content);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="reading-frame frame-stack py-12 xl:py-16"
    >
      <div className="reading-column">
        <Link href="/en/blog" className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors mb-12 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          RETURN_TO_LOGS
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
            <span className={`font-mono text-xs px-3 py-1.5 border ${post.meta.severity === 'CRITICAL' ? 'text-error border-error/30 bg-error/10' : 'text-error/80 border-error/20'}`}>
              SEVERITY: {post.meta.severity}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              AUTHOR: {post.meta.author}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter leading-tight mb-8">
            {post.meta.title.toUpperCase()}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {post.meta.tags.map(tag => (
                <span key={tag} className="font-mono text-[10px] text-on-surface-variant/80 uppercase bg-surface-container px-3 py-1 border border-outline-variant/20">
                  #{tag}
                </span>
              ))}
            </div>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div
          className="prose prose-invert prose-p:text-on-surface-variant prose-p:font-light prose-p:leading-relaxed prose-headings:font-headline prose-headings:text-on-surface prose-a:text-primary prose-strong:text-on-surface prose-pre:bg-[#0c0e12] prose-pre:border prose-pre:border-outline-variant/20 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mt-24 pt-12 border-t border-outline-variant/20">
          <div className="bg-surface-container-low p-8 border-l-4 border-primary flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-surface-container-highest border border-primary/30 flex items-center justify-center shrink-0">
              <span className="font-headline font-bold text-xl text-primary">0x</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg text-on-surface mb-2">ABOUT THE AUTHOR</h4>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Romain Stride (0x7E3) is a Senior Security Researcher focusing on web application security and exploit development. When not breaking things, he builds secure architectures.
              </p>
            </div>
          </div>
        </footer>
        </article>
      </div>
    </motion.div>
  );
}
