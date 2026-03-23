'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ShieldAlert, Code, Terminal, Database, FileText } from 'lucide-react';
import { BlogPostMeta } from '@/lib/markdown';

const IconMap: Record<string, React.ReactNode> = {
  Database: <Database className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Default: <FileText className="w-5 h-5" />
};

export function BlogList({ posts, locale }: { posts: BlogPostMeta[], locale: 'fr' | 'en' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = !selectedSeverity || post.severity === selectedSeverity;
      const matchesCategory = !selectedCategory || post.tags.includes(selectedCategory);

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [posts, searchQuery, selectedSeverity, selectedCategory]);

  const categories = Array.from(new Set(posts.flatMap(post => post.tags)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Sidebar / Filters */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-surface-container p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/20 pb-4">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-headline font-bold uppercase text-on-surface">
              {locale === 'fr' ? 'RECHERCHE' : 'QUERY'}
            </h3>
          </div>
          <input 
            type="text" 
            placeholder={locale === 'fr' ? "Rechercher..." : "Search logs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/30 px-4 py-3 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
          />
        </div>

        <div className="bg-surface-container p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/20 pb-4">
            <Filter className="w-5 h-5 text-secondary" />
            <h3 className="font-headline font-bold uppercase text-on-surface">
              {locale === 'fr' ? 'FILTRES' : 'FILTERS'}
            </h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
                {locale === 'fr' ? 'SÉVÉRITÉ' : 'SEVERITY'}
              </h4>
              <div className="space-y-2">
                {['CRITICAL', 'HIGH', 'MEDIUM'].map(severity => (
                  <label key={severity} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="severity" 
                      className="hidden" 
                      checked={selectedSeverity === severity}
                      onChange={() => setSelectedSeverity(selectedSeverity === severity ? null : severity)}
                      onClick={() => {
                        if (selectedSeverity === severity) {
                          setSelectedSeverity(null);
                        }
                      }}
                    />
                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedSeverity === severity ? 'border-primary' : 'border-outline-variant/50 group-hover:border-primary/50'}`}>
                      {selectedSeverity === severity && <div className="w-2 h-2 bg-primary"></div>}
                    </div>
                    <span className={`font-mono text-xs ${selectedSeverity === severity ? 'text-primary' : 'text-on-surface'}`}>
                      {severity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
                {locale === 'fr' ? 'CATÉGORIES' : 'CATEGORIES'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSelectedCategory(selectedCategory === tag ? null : tag)}
                    className={`px-3 py-1 font-mono text-[10px] uppercase border transition-colors ${
                      selectedCategory === tag 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-surface-container-highest border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="lg:col-span-9 space-y-6">
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-8">
          <span className="font-mono text-xs text-on-surface-variant">
            {locale === 'fr' ? `Affichage de ${filteredPosts.length} entrées` : `Showing ${filteredPosts.length} entries`}
          </span>
          <div className="font-mono text-xs text-on-surface-variant flex gap-4">
            <span className="text-on-surface-variant/60">
              {locale === 'fr' ? 'TRI: PLUS RÉCENT' : 'SORT: NEWEST'}
            </span>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-surface-container p-12 text-center border border-outline-variant/20">
            <p className="font-mono text-on-surface-variant">
              {locale === 'fr' ? 'Aucun résultat trouvé pour votre recherche.' : 'No results found for your query.'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link href={locale === 'fr' ? `/blog/${post.slug}` : `/en/blog/${post.slug}`} key={post.id} className="block group">
              <article className="bg-surface-container p-6 md:p-8 border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-outline-variant/20 group-hover:bg-primary transition-colors"></div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                        {post.id}
                      </span>
                      <span className="font-mono text-[10px] text-on-surface-variant">
                        {post.date}
                      </span>
                      <span className={`font-mono text-[10px] px-2 py-1 border ${post.severity === 'CRITICAL' ? 'text-error border-error/30 bg-error/10' : 'text-error/80 border-error/20'}`}>
                        {post.severity}
                      </span>
                    </div>
                    <h2 className="text-2xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <div className="hidden md:flex p-3 bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant group-hover:text-primary group-hover:border-primary/30 transition-colors">
                    {IconMap[post.icon] || IconMap.Default}
                  </div>
                </div>
                
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-light max-w-3xl">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="font-mono text-[10px] text-on-surface-variant/60 uppercase before:content-['#'] before:text-primary/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                    READ_LOG &gt;
                  </span>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
