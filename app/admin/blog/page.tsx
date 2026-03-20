'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useBlogStore } from '@/lib/useBlogStore';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { FileEdit, Trash2, PlusCircle, Save } from 'lucide-react';

export default function AdminBlogPage() {
  const router = useRouter();
  const { language } = useApp();
  const { currentUser } = useAuthStore();
  const { posts, addPost, deletePost, isLoaded } = useBlogStore();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    pdfUrl: '',
    category: ''
  });

  // Authorization Check & Redirect
  useEffect(() => {
    if (!currentUser || currentUser.email.toLowerCase() !== 'admin@admin.com') {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.email.toLowerCase() !== 'admin@admin.com') {
    return null; // Return empty while redirecting
  }

  if (!isLoaded) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    addPost({
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1550592704-6c7b94b053dd?auto=format&fit=crop&q=80',
      pdfUrl: formData.pdfUrl || undefined,
      category: formData.category || 'Genel'
    });

    setFormData({ title: '', summary: '', content: '', imageUrl: '', pdfUrl: '', category: '' });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full p-6 lg:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="flex justify-between items-center mb-8 border-b border-[var(--border-accent)] pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileEdit className="text-[var(--accent-purple)]" /> 
            {t(language, 'adminPanel')}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 glass-card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <PlusCircle size={20} className="text-[var(--accent-cyan)]" />
              {t(language, 'newPost')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <input
                className="input-field"
                placeholder={t(language, 'title')}
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <input
                className="input-field"
                placeholder="Özet"
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                required
              />
              <input
                className="input-field"
                placeholder={t(language, 'category')}
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
              <input
                className="input-field"
                placeholder={t(language, 'imageUrl')}
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
              <input
                className="input-field border-[var(--accent-purple)]/30"
                placeholder="PDF Linki (Opsiyonel)"
                value={formData.pdfUrl}
                onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
              />
              <textarea
                className="input-field min-h-[200px] resize-y"
                placeholder={t(language, 'content')}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
              />
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> {t(language, 'saveRef')}
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Mevcut Yazılar ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-[var(--text-muted)]">Burada henüz hiç yazı yok.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="glass-card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-white text-lg line-clamp-1">{post.title}</h3>
                      <div className="flex gap-3 text-xs text-[var(--text-muted)] font-medium mt-1">
                        <span className="text-[var(--accent-cyan)]">{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
