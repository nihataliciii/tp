'use client';

import { useBlogStore } from '@/lib/useBlogStore';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

export default function BlogList() {
  const { posts, isLoaded } = useBlogStore();
  const { language } = useApp();

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple" style={{ top: '-10%', left: '-10%', width: '60vw', height: '60vw', filter: 'blur(150px)' }} />
      <div className="orb orb-cyan" style={{ bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', filter: 'blur(140px)' }} />
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white font-space glow-text uppercase">
            {t(language, 'blogTitle')}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
            Dikkat, nörobilim ve dijital minimalizm üzerine bilimsel notlar.
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin glow-border" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id} 
                className="group glass-card overflow-hidden hover:border-[var(--accent-cyan)] transition-all duration-500 rounded-2xl flex flex-col h-full transform hover:-translate-y-2 glow-border"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 opacity-60" />
                  <img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1550592704-6c7b94b053dd?auto=format&fit=crop&q=80'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--accent-purple)] text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-3">
                    <Calendar size={14} />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-[var(--accent-cyan-light)] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-[var(--text-secondary)] line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
                    {post.summary}
                  </p>
                  
                  <div className="flex items-center text-[var(--accent-cyan)] font-semibold mt-auto group-hover:text-[var(--accent-purple-light)] transition-colors text-sm uppercase tracking-wider">
                    {t(language, 'readMore')} <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
            
            {posts.length === 0 && (
              <div className="col-span-full text-center py-20 text-[var(--text-muted)]">
                <p>Henüz hiç yazı bulunmuyor.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .glow-text {
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(124, 58, 237, 0.3);
        }
        .glow-border:hover {
          box-shadow: 0 0 20px -5px rgba(0, 255, 255, 0.4);
        }
      `}} />
    </div>
  );
}
