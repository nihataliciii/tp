'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBlogStore } from '@/lib/useBlogStore';
import { useApp } from '@/lib/AppContext';
import { ChevronLeft, Calendar, FileText } from 'lucide-react';

export default function BlogPostDetail() {
  const params = useParams();
  const router = useRouter();
  const { posts, isLoaded } = useBlogStore();
  const { language } = useApp();

  const post = posts.find(p => p.id === params.id);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin glow-border" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] p-6 text-center">
        <h1 className="text-3xl text-white font-bold mb-4">Post bulunamadı.</h1>
        <button onClick={() => router.push('/blog')} className="text-[var(--accent-cyan)] hover:underline flex items-center">
          <ChevronLeft size={16} /> Geri dön
        </button>
      </div>
    );
  }

  return (
    <article className="relative min-h-[calc(100vh-64px)] w-full bg-[#0a0a0f] text-[var(--text-primary)]">
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[#0a0a0f]/30 z-10" /> {/* Slight dark overlay */}
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => router.push('/blog')}
          className="absolute top-6 left-4 sm:left-8 z-20 flex items-center gap-2 px-4 py-2 glass-card rounded-full hover:bg-white/10 transition text-white text-sm backdrop-blur-md"
        >
          <ChevronLeft size={16} /> Blog
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--accent-purple)] text-white shadow-[0_0_15px_rgba(124,58,237,0.6)]">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              <Calendar size={14} />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-space text-shadow">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative z-20 bg-[#0a0a0f]">
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
          
          {post.pdfUrl && (
            <div className="mb-10 animate-fade-in-up">
              <a 
                href={post.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[rgba(124,58,237,0.15)] border border-[var(--accent-purple)] text-[var(--accent-purple-light)] hover:bg-[var(--accent-purple)] hover:text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:-translate-y-1"
              >
                <FileText size={24} /> 
                PDF Dökümanını Görüntüle / İndir
              </a>
            </div>
          )}

          <p className="text-xl md:text-2xl text-[var(--accent-cyan-light)] font-medium mb-10 leading-relaxed">
            {post.summary}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] mb-10 rounded-full" />
          
          <div 
            className="text-[var(--text-secondary)] leading-loose space-y-6"
            style={{ fontSize: '1.125rem' }}
          >
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
