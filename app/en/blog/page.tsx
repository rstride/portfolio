import * as motion from 'motion/react-client';
import { getBlogPosts } from '@/lib/markdown';
import { BlogList } from '@/components/blog-list';

export default function BlogArchive() {
  const posts = getBlogPosts('en');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-24 py-12 max-w-7xl mx-auto"
    >
      <header className="mb-16">
        <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">
          Knowledge Base // Vulnerability Research
        </span>
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
          SECURITY_LOGS .
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed font-light max-w-2xl">
          Technical write-ups, vulnerability analyses, and offensive security research. Documenting exploitation to better understand defense.
        </p>
      </header>

      <BlogList posts={posts} locale="en" />
    </motion.div>
  );
}
