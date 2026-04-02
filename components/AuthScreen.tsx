'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { Eye, EyeOff, Zap, Lock, Mail, User, ShieldCheck, Clock, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const { setStage, language } = useApp();
  const { currentUser } = useAuthStore();
  const router = useRouter();
  
  const handleHeroCTA = () => {
    if (!currentUser) {
      router.push('/login');
    } else {
      router.push('/test'); // Or handle test routing logically
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050508] flex items-center">
      {/* 
        ================ ANTI-GRAVITY BACKGROUND ================
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="bg-noise absolute inset-0 mix-blend-overlay opacity-20" />
        
        {/* Large Orbs */}
        <div className="orb orb-purple opacity-40 animate-float-slow" style={{ top: '-10%', left: '-5%', width: '40vw', height: '40vw' }} />
        <div className="orb orb-cyan opacity-40 animate-float-slower" style={{ bottom: '10%', right: '-10%', width: '50vw', height: '50vw' }} />
        
        {/* 3D Glass Spheres Floating */}
        <div className="absolute top-[15%] left-[60%] w-32 h-32 glass-sphere animate-float-slow" />
        <div className="absolute bottom-[20%] left-[10%] w-24 h-24 glass-sphere animate-float-slower" />
        <div className="absolute top-[40%] right-[5%] w-16 h-16 glass-sphere animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[70%] left-[45%] w-40 h-40 glass-sphere animate-float-slow" style={{ animationDelay: '1s', opacity: 0.5 }} />
      </div>

      {/* 
        ================ MAIN CONTENT CONTAINER ================
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16 lg:py-0 flex flex-col justify-center items-center text-center min-h-[calc(100vh-64px)]">
        
        {/* CENTER COLUMN: HERO & FEATURES */}
        <div className="animate-fade-in-up flex flex-col items-center space-y-10 pt-8 lg:pt-0">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan-light)] text-sm font-semibold tracking-wide">
              <Activity size={16} /> Beta v0.1.0
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[var(--text-primary)] to-[var(--accent-cyan-light)] font-space leading-[1.05] drop-shadow-lg max-w-5xl mx-auto">
              {t(language, 'heroTitle')}
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-[1.7] max-w-2xl font-light">
              {t(language, 'heroSubtitle')}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Massive CTA area */}
            <div className="w-full max-w-2xl relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-cyan)] to-[var(--accent-pink)] opacity-20 blur-2xl animate-pulse" />
              <button 
                onClick={handleHeroCTA}
                className="group relative w-full inline-flex items-center justify-center gap-4 font-black text-2xl md:text-3xl py-8 px-12 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] bg-gradient-to-r from-[var(--accent-purple)] via-purple-600 to-[var(--accent-cyan)] text-white uppercase tracking-widest shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                <Zap className="text-white group-hover:scale-125 transition-transform shrink-0" size={36} />
                <span>{t(language, 'ctaStartTest')}</span>
              </button>
            </div>
            {!currentUser && (
              <p className="text-base text-[var(--accent-cyan)] opacity-80 font-medium">{t(language, 'warnGuest')}</p>
            )}
          </div>


          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-20 mt-10 border-t border-[var(--border-accent)] w-full">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-purple)]/20 flex items-center justify-center border border-[var(--accent-purple)]/30 text-[var(--accent-purple-light)]">
                <Clock size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">{t(language, 'feature1Title')}</h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-[250px]">{t(language, 'feature1Desc')}</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-cyan)]/20 flex items-center justify-center border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan-light)]">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">{t(language, 'feature2Title')}</h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-[250px]">{t(language, 'feature2Desc')}</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30 text-pink-400">
                <Zap size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">{t(language, 'feature3Title')}</h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-[250px]">{t(language, 'feature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
