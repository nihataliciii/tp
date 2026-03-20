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
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:py-0 flex flex-col justify-center items-center text-center min-h-[calc(100vh-64px)]">
        
        {/* CENTER COLUMN: HERO & FEATURES */}
        <div className="animate-fade-in-up flex flex-col items-center space-y-10 pt-8 lg:pt-0">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan-light)] text-sm font-semibold tracking-wide">
              <Activity size={16} /> Beta v0.1.0
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[var(--text-primary)] to-[var(--accent-cyan-light)] font-space leading-tight drop-shadow-lg max-w-4xl mx-auto">
              {t(language, 'heroTitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl font-light">
              {t(language, 'heroSubtitle')}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={handleHeroCTA}
              className="group relative w-fit inline-flex items-center justify-center gap-3 bg-white text-black font-bold text-lg px-8 py-4 rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan-light)] to-[var(--accent-purple-light)] opacity-0 group-hover:opacity-20 transition-opacity" />
              <Zap className="text-[var(--accent-purple)] group-hover:scale-110 transition-transform" />
              <span>{t(language, 'ctaStartTest')}</span>
            </button>
            {!currentUser && (
              <p className="text-sm text-[var(--accent-cyan)] opacity-80">{t(language, 'warnGuest')}</p>
            )}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 mt-8 border-t border-[var(--border-accent)] w-full">
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/20 flex items-center justify-center border border-[var(--accent-purple)]/30 text-[var(--accent-purple-light)]">
                <Clock size={24} />
              </div>
              <h3 className="text-white font-semibold text-base">{t(language, 'feature1Title')}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[250px]">{t(language, 'feature1Desc')}</p>
            </div>
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/20 flex items-center justify-center border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan-light)]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-white font-semibold text-base">{t(language, 'feature2Title')}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[250px]">{t(language, 'feature2Desc')}</p>
            </div>
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30 text-pink-400">
                <Zap size={24} />
              </div>
              <h3 className="text-white font-semibold text-base">{t(language, 'feature3Title')}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[250px]">{t(language, 'feature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
