'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { Zap, ShieldCheck, Clock, Activity } from 'lucide-react';

export default function AuthScreen() {
  const { language } = useApp();
  const { currentUser } = useAuthStore();
  const router = useRouter();

  const handleHeroCTA = () => {
    if (!currentUser) {
      router.push('/login');
    } else {
      router.push('/test');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex items-center"
      style={{ background: 'var(--bg-primary)' }}>

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-20" />

        {/* Soft orbs — toned down */}
        <div className="orb orb-purple opacity-20 animate-float-slow"
          style={{ top: '-5%', left: '-5%', width: '28vw', height: '28vw' }} />
        <div className="orb orb-cyan opacity-20 animate-float-slower"
          style={{ bottom: '5%', right: '-8%', width: '32vw', height: '32vw' }} />

        {/* Subtle glass spheres */}
        <div className="absolute top-[14%] left-[64%] w-16 h-16 glass-sphere animate-float-slow" />
        <div className="absolute bottom-[24%] left-[7%] w-12 h-12 glass-sphere animate-float-slower" />
        <div className="absolute top-[50%] right-[4%] w-8 h-8 glass-sphere animate-float"
          style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 flex flex-col justify-center items-center text-center gap-8">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide"
          style={{
            borderColor: 'var(--accent-cyan)',
            background: 'rgba(6,182,212,0.08)',
            color: 'var(--accent-cyan-light)',
          }}>
          <Activity size={12} />
          Beta v0.1.0
        </div>

        {/* Hero title — sane sizing, Inter Tight for correct Turkish rendering */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
          style={{
            fontFamily: "'Inter Tight', 'Inter', system-ui, sans-serif",
            background: 'linear-gradient(135deg, var(--text-primary) 60%, var(--accent-cyan-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {t(language, 'heroTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base leading-relaxed max-w-lg"
          style={{ color: 'var(--text-secondary)' }}>
          {t(language, 'heroSubtitle')}
        </p>

        {/* CTA button — proportionate, soft glow */}
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-2 rounded-2xl opacity-15 blur-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' }} />
          <button
            onClick={handleHeroCTA}
            className="group relative w-full inline-flex items-center justify-center gap-3 font-semibold text-sm py-4 px-8 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] text-white uppercase tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              boxShadow: '0 2px 20px rgba(124,58,237,0.25)',
              letterSpacing: '0.08em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 32px rgba(124,58,237,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 20px rgba(124,58,237,0.25)';
            }}
          >
            <Zap size={16} className="group-hover:scale-110 transition-transform" />
            <span>{t(language, 'ctaStartTest')}</span>
          </button>
        </div>

        {!currentUser && (
          <p className="text-xs" style={{ color: 'var(--accent-cyan)', opacity: 0.8 }}>
            {t(language, 'warnGuest')}
          </p>
        )}

        {/* Feature grid — compact, theme-aware */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-2 w-full border-t"
          style={{ borderColor: 'var(--border-accent)' }}>

          {[
            { icon: Clock, titleKey: 'feature1Title', descKey: 'feature1Desc', color: 'var(--accent-purple-light)', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
            { icon: ShieldCheck, titleKey: 'feature2Title', descKey: 'feature2Desc', color: 'var(--accent-cyan-light)', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
            { icon: Zap, titleKey: 'feature3Title', descKey: 'feature3Desc', color: '#f472b6', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
          ].map(({ icon: Icon, titleKey, descKey, color, bg, border }) => (
            <div key={titleKey} className="flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: bg, border: `1px solid ${border}`, color }}>
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {t(language, titleKey as any)}
              </h3>
              <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                {t(language, descKey as any)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
