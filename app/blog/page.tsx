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
    <div className="w-full min-h-[calc(100vh-80px)]" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle background */}
      <div className="orb orb-purple opacity-15 fixed" style={{ top: '-5%', left: '-5%', width: '25vw', height: '25vw' }} />
      <div className="orb orb-cyan opacity-15 fixed" style={{ bottom: '-5%', right: '-5%', width: '20vw', height: '20vw' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t(language, 'blogTitle')}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Dikkat, nörobilim ve dijital minimalizm üzerine bilimsel notlar.
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            Henüz yayınlanmış yazı yok.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link
                href={`/blog/${post.id}`}
                key={post.id}
                className="group glass-card glass-card-hover overflow-hidden flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 z-10 opacity-50"
                    style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }}
                  />
                  <img
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1550592704-6c7b94b053dd?auto=format&fit=crop&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--accent-purple)', color: '#fff' }}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h2 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-[var(--accent-cyan-light)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </h2>
                  <p className="text-xs line-clamp-2 leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      {new Date(post.date || Date.now()).toLocaleDateString()}
                    </span>
                    <ChevronRight size={14} style={{ color: 'var(--accent-cyan)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
