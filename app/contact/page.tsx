'use client';

import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import { Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const { language } = useApp();
  const isTR = language === 'tr';

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-x-hidden">
      {/* Background */}
      <div className="orb orb-purple opacity-20 animate-float-slow" style={{ top: '-5%', left: '-5%', width: '45vw', height: '45vw' }} />
      <div className="orb orb-cyan opacity-20 animate-float-slower" style={{ bottom: '-5%', right: '-5%', width: '40vw', height: '40vw' }} />
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none opacity-30" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] text-sm font-semibold tracking-wide mb-6 uppercase" style={{ letterSpacing: '0.1em' }}>
            <MessageCircle size={14} />
            {isTR ? 'Bize Ulaşın' : 'Get in Touch'}
          </div>
          <h1
            className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-6 uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}
          >
            {isTR ? 'İletişim' : 'Contact'}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {isTR
              ? 'Sorularınız, geri bildirimleriniz veya iş birliği teklifleriniz için bize ulaşın.'
              : 'Reach out for questions, feedback, or collaboration opportunities.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Contact Info Cards */}
          <div className="flex flex-col gap-5">
            {/* Email */}
            <a
              href="mailto:hello@timeperception.app"
              className="glass-card p-8 flex items-start gap-5 glass-card-hover group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={28} className="text-[var(--accent-purple-light)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{isTR ? 'E-posta' : 'Email'}</h3>
                <p className="text-[var(--text-secondary)] text-base mb-3">
                  {isTR ? 'Her türlü soru ve öneriniz için.' : 'For all your questions and suggestions.'}
                </p>
                <span className="text-[var(--accent-cyan)] font-semibold text-lg group-hover:text-[var(--accent-cyan-light)] transition-colors flex items-center gap-2">
                  hello@timeperception.app
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </a>

            {/* Response time */}
            <div className="glass-card p-8 flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 flex items-center justify-center shrink-0">
                <Clock size={28} className="text-[var(--accent-cyan)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{isTR ? 'Yanıt Süresi' : 'Response Time'}</h3>
                <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                  {isTR ? 'Mesajlarınızı genellikle 24-48 saat içinde yanıtlıyoruz.' : 'We usually reply within 24-48 hours on business days.'}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {isTR ? 'Aktif' : 'Active'}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="glass-card p-8 flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
                <MapPin size={28} className="text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{isTR ? 'Konum' : 'Location'}</h3>
                <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                  {isTR ? 'Türkiye merkezli, dünyaya açık bir proje.' : 'Turkey-based project, open to the world.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col gap-5">
            {/* Big mailto CTA */}
            <div
              className="glass-card p-10 flex flex-col items-center text-center gap-6"
              style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))' }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                <Mail size={36} className="text-slate-800 dark:text-white" />
              </div>
              <div>
                <h2
                  className="text-3xl font-black text-slate-800 dark:text-white mb-3 uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}
                >
                  {isTR ? 'Mesaj Gönder' : 'Send a Message'}
                </h2>
                <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                  {isTR
                    ? 'Aşağıdaki butona tıklayarak direkt mail uygulamanız açılacak.'
                    : 'Click the button below to open your mail app directly.'}
                </p>
              </div>
              <a
                href="mailto:hello@timeperception.app?subject=TimePerception%20Geribildirim&body=Merhaba%2C"
                className="w-full inline-flex items-center justify-center gap-3 font-black text-xl py-6 px-8 rounded-2xl bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white uppercase tracking-widest shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] hover:scale-[1.02] transition-all duration-300"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
              >
                <Mail size={24} />
                {isTR ? 'Mail Uygulamasını Aç' : 'Open Mail App'}
              </a>
              <p className="text-sm text-[var(--text-muted)]">
                hello@timeperception.app
              </p>
            </div>

            {/* Forum link */}
            <Link
              href="/forum"
              className="glass-card p-7 flex items-center gap-5 glass-card-hover group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} className="text-[var(--accent-cyan)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{isTR ? 'Topluluk Forumu' : 'Community Forum'}</h3>
                <p className="text-[var(--text-secondary)] text-base">
                  {isTR ? 'Diğer kullanıcılarla tartış, deneyimlerini paylaş.' : 'Discuss with other users, share your experiences.'}
                </p>
              </div>
              <span className="text-[var(--accent-cyan)] text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
