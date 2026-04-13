'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { MessageCircle, Heart, Reply, Pin, TrendingUp, Users, Flame, Star, ChevronRight, PlusCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const PLACEHOLDER_THREADS = [
  {
    id: 1,
    pinned: true,
    category: 'Duyuru',
    categoryEn: 'Announcement',
    categoryColor: '#f59e0b',
    title: 'TimePerception v0.1 yayında! — Topluluk kuralları ve başlangıç rehberi',
    titleEn: 'TimePerception v0.1 is live! — Community rules and getting started guide',
    author: 'Admin',
    avatarColor: 'from-purple-500 to-cyan-500',
    time: '2 gün önce',
    timeEn: '2 days ago',
    replies: 12,
    likes: 47,
    excerpt: 'Platforma hoşgeldiniz! Bu başlıkta topluluk kurallarını ve nasıl başlayacağınızı bulabilirsiniz.',
    excerptEn: 'Welcome to the platform! This thread has community rules and how to get started.',
  },
  {
    id: 2,
    pinned: false,
    category: 'Deneyim',
    categoryEn: 'Experience',
    categoryColor: '#10b981',
    title: 'Zaman algı skorum çok düşük çıktı — ekran süresini azaltınca ne değişti',
    titleEn: 'My time perception score was very low — what changed when I reduced screen time',
    author: 'Kerem_T',
    avatarColor: 'from-green-500 to-teal-500',
    time: '5 saat önce',
    timeEn: '5 hours ago',
    replies: 8,
    likes: 23,
    excerpt: 'Test sonucum 0.72x çıktı. Bunu iyileştirmek için 3 hafta boyunca günlük ekran süresimi kıstım ve...',
    excerptEn: 'My score was 0.72x. To improve it, I limited my daily screen time for 3 weeks and...',
  },
  {
    id: 3,
    pinned: false,
    category: 'Soru',
    categoryEn: 'Question',
    categoryColor: '#06b6d4',
    title: 'Anket soruları TPR hesaplamasını nasıl etkiliyor? Detaylı açıklama var mı?',
    titleEn: 'How do the survey questions affect TPR calculation? Is there a detailed explanation?',
    author: 'Elif_S',
    avatarColor: 'from-cyan-500 to-blue-500',
    time: '1 gün önce',
    timeEn: '1 day ago',
    replies: 5,
    likes: 14,
    excerpt: 'Anket tamamlandıktan sonra hesaplama nasıl yapılıyor? Bilimsel dayanağını merak ediyorum.',
    excerptEn: 'How is the calculation done after completing the survey? I\'m curious about the scientific basis.',
  },
  {
    id: 4,
    pinned: false,
    category: 'Tartışma',
    categoryEn: 'Discussion',
    categoryColor: '#ec4899',
    title: 'Kısa video içeriği (Reels/TikTok) beynin zaman algısını gerçekten bozuyor mu?',
    titleEn: 'Does short-form video content (Reels/TikTok) really distort the brain\'s time perception?',
    author: 'Mert_K',
    avatarColor: 'from-pink-500 to-red-500',
    time: '3 gün önce',
    timeEn: '3 days ago',
    replies: 21,
    likes: 56,
    excerpt: 'Nörobilim perspektifinden bakalım. Dopamin döngüleri, dikkat süreleri ve...',
    excerptEn: 'Let\'s look at it from a neuroscience perspective. Dopamine cycles, attention spans and...',
  },
  {
    id: 5,
    pinned: false,
    category: 'İpuçları',
    categoryEn: 'Tips',
    categoryColor: '#a855f7',
    title: 'Test sırasında daha iyi sonuç almak için kullandığım yöntemler',
    titleEn: 'Methods I use to get better results during the test',
    author: 'Bora_A',
    avatarColor: 'from-purple-500 to-pink-500',
    time: '12 saat önce',
    timeEn: '12 hours ago',
    replies: 3,
    likes: 19,
    excerpt: 'Birkaç ipucu: sessiz ortamda test yapın, test öncesi 5 dakika meditasyon deneyin...',
    excerptEn: 'A few tips: take the test in a quiet environment, try 5 minutes of meditation before testing...',
  },
];

const CATEGORIES = [
  { label: 'Tümü', labelEn: 'All', color: '#ffffff', icon: Flame },
  { label: 'Deneyim', labelEn: 'Experience', color: '#10b981', icon: TrendingUp },
  { label: 'Tartışma', labelEn: 'Discussion', color: '#ec4899', icon: MessageCircle },
  { label: 'Soru', labelEn: 'Question', color: '#06b6d4', icon: Reply },
  { label: 'İpuçları', labelEn: 'Tips', color: '#a855f7', icon: Star },
];

export default function ForumPage() {
  const { language } = useApp();
  const { currentUser } = useAuthStore();
  const isTR = language === 'tr';
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const filtered = activeCategory === 'Tümü' || activeCategory === 'All'
    ? PLACEHOLDER_THREADS
    : PLACEHOLDER_THREADS.filter(t =>
        isTR ? t.category === activeCategory : t.categoryEn === activeCategory
      );

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-x-hidden">
      {/* Background */}
      <div className="orb orb-purple opacity-15 animate-float-slow" style={{ top: '-5%', left: '-5%', width: '40vw', height: '40vw' }} />
      <div className="orb orb-cyan opacity-15 animate-float-slower" style={{ bottom: '0', right: '-5%', width: '35vw', height: '35vw' }} />
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none opacity-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] text-sm font-semibold tracking-wide mb-4 uppercase" style={{ letterSpacing: '0.1em' }}>
                <Users size={14} />
                {isTR ? 'Topluluk' : 'Community'}
              </div>
              <h1
                className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}
              >
                {isTR ? 'Forum' : 'Forum'}
              </h1>
              <p className="text-[var(--text-secondary)] text-lg mt-2">
                {isTR
                  ? 'Zaman algısı, odak ve dijital sağlık üzerine tartışın.'
                  : 'Discuss time perception, focus, and digital wellbeing.'}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {[
                { icon: MessageCircle, label: isTR ? 'Konu' : 'Threads', value: '127' },
                { icon: Users, label: isTR ? 'Üye' : 'Members', value: '2.4K' },
                { icon: Heart, label: isTR ? 'Beğeni' : 'Likes', value: '8.9K' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</p>
                  <p className="text-sm text-[var(--text-muted)] font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming soon banner */}
        <div
          className="glass-card p-5 mb-8 flex items-center gap-4 border-[var(--accent-purple)]/30"
          style={{ background: 'rgba(124,58,237,0.06)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)]/20 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-[var(--accent-purple-light)]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white text-base">{isTR ? 'Forum Yakında Açılıyor' : 'Forum Coming Soon'}</p>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              {isTR
                ? 'Şu an gösterilen veriler önizleme amaçlıdır. Gerçek konu oluşturma yakında aktif olacak.'
                : 'Data shown here is for preview purposes. Real thread creation will be activated soon.'}
            </p>
          </div>
          <button className="btn-primary text-sm px-5 py-3 opacity-60 cursor-not-allowed" style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '44px' }}>
            {isTR ? 'Bildir' : 'Notify Me'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main: Thread list */}
          <div className="flex-1 min-w-0">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map((cat) => {
                const label = isTR ? cat.label : cat.labelEn;
                const isActive = activeCategory === cat.label || activeCategory === cat.labelEn;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(isActive ? (isTR ? 'Tümü' : 'All') : (isTR ? cat.label : cat.labelEn))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]"
                    style={{
                      background: isActive ? `${cat.color}20` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? cat.color : 'var(--border-accent)'}`,
                      color: isActive ? cat.color : 'var(--text-secondary)',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* New thread button */}
            {currentUser ? (
              <button
                className="w-full glass-card p-5 flex items-center gap-3 mb-6 border-dashed border-[var(--accent-purple)]/40 hover:border-[var(--accent-purple)] transition-colors group cursor-not-allowed opacity-60"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)]/15 flex items-center justify-center group-hover:bg-[var(--accent-purple)]/25 transition-colors">
                  <PlusCircle size={20} className="text-[var(--accent-purple-light)]" />
                </div>
                <span className="text-[var(--text-secondary)] font-medium">
                  {isTR ? 'Yeni Konu Aç (Yakında)' : 'New Thread (Coming Soon)'}
                </span>
              </button>
            ) : (
              <Link href="/login" className="w-full glass-card p-5 flex items-center gap-3 mb-6 border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-cyan)]/15 flex items-center justify-center">
                  <PlusCircle size={20} className="text-[var(--accent-cyan)]" />
                </div>
                <span className="text-[var(--accent-cyan)] font-medium">
                  {isTR ? 'Konu açmak için giriş yap' : 'Log in to create threads'}
                </span>
              </Link>
            )}

            {/* Thread list */}
            <div className="flex flex-col gap-4">
              {filtered.map((thread) => (
                <div
                  key={thread.id}
                  className="glass-card p-6 glass-card-hover cursor-pointer"
                  style={thread.pinned ? { borderColor: `${thread.categoryColor}40`, background: `${thread.categoryColor}05` } : {}}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${thread.avatarColor} flex items-center justify-center shrink-0 text-white font-bold text-sm`}>
                      {thread.author[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {thread.pinned && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b]">
                            <Pin size={10} /> {isTR ? 'Sabitlenmiş' : 'Pinned'}
                          </span>
                        )}
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: `${thread.categoryColor}20`, color: thread.categoryColor, border: `1px solid ${thread.categoryColor}30` }}
                        >
                          {isTR ? thread.category : thread.categoryEn}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                        {isTR ? thread.title : thread.titleEn}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-1">
                        {isTR ? thread.excerpt : thread.excerptEn}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                        <span className="font-medium">{thread.author}</span>
                        <span>·</span>
                        <span>{isTR ? thread.time : thread.timeEn}</span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Reply size={14} /> {thread.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} /> {thread.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
            {/* Trending */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame size={18} className="text-orange-400" />
                {isTR ? 'Popüler Konular' : 'Trending'}
              </h3>
              <div className="flex flex-col gap-3">
                {PLACEHOLDER_THREADS.sort((a, b) => b.likes - a.likes).slice(0, 3).map((t, i) => (
                  <div key={t.id} className="flex gap-3 items-start">
                    <span className="text-2xl font-black text-[var(--text-muted)] w-6 shrink-0" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {i + 1}
                    </span>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-snug">
                      {isTR ? t.title : t.titleEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Join CTA */}
            {!currentUser && (
              <div
                className="glass-card p-6 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }}
              >
                <Users size={32} className="text-[var(--accent-purple-light)] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isTR ? 'Topluluğa Katıl' : 'Join the Community'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {isTR ? 'Konu aç, yorum yap, deneyimlerini paylaş.' : 'Create threads, comment, share experiences.'}
                </p>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white font-bold text-sm hover:scale-[1.02] transition-transform"
                >
                  {isTR ? 'Kayıt Ol' : 'Sign Up'} <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
