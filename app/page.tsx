'use client';

import AuthScreen from '@/components/AuthScreen';
import { useBlogStore } from '@/lib/useBlogStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { posts } = useBlogStore();
  const latestPosts = posts.slice(0, 3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#050508]">
      {/* Landing Hero Area */}
      <AuthScreen />
      
      {/* Blog Teaser Section */}
      {mounted && latestPosts.length > 0 && (
        <div className="w-full relative z-20 pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-purple-light)]">
                Son Yazılarımız
              </h2>
              <Link href="/blog" className="text-sm font-semibold text-[var(--accent-cyan)] flex items-center gap-1 hover:text-[var(--accent-cyan-light)] transition-colors">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.id}`} 
                  className="glass-card p-5 group hover:-translate-y-2 hover:border-[var(--accent-cyan)] transition-transform duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4">
                    <img 
                      src={post.imageUrl} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                      alt={post.title}
                    />
                    <div className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-purple)] px-2 py-0.5 rounded-full text-white">
                      {post.category}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-cyan-light)] transition-colors line-clamp-2 leading-tight mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
