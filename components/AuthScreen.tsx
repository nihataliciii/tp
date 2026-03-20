'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Eye, EyeOff, Zap, Lock, Mail, User, ShieldCheck, Clock, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const { setStage, setUser, language } = useApp();
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestWarning, setGuestWarning] = useState(false);
  
  const authRef = useRef<HTMLDivElement>(null);

  // Mock checking lists
  const REGISTERED_EMAILS = ['test@test.com', 'admin@admin.com', 'demo@test.com'];
  const TAKEN_USERNAMES = ['admin', 'test', 'demo', 'nihat', 'root'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) { setError(t(language, 'fillFields')); return; }
    
    if (mode === 'signup') {
      if (!name) { setError(t(language, 'enterName')); return; }
      
      // Live unique username validation check
      if (TAKEN_USERNAMES.includes(name.toLowerCase())) {
        setError(t(language, 'usernameTaken'));
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t(language, 'invalidEmail'));
      return;
    }
    
    if (mode === 'login' && !REGISTERED_EMAILS.includes(email.toLowerCase())) {
      setError(t(language, 'unregisteredEmail'));
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUser({ name: mode === 'signup' ? name : email.split('@')[0], email });
    setStage('survey');
  };

  const handleHeroCTA = () => {
    // Scroll to auth, trigger warning
    setGuestWarning(true);
    authRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setGuestWarning(false), 4000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050508] flex items-center">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-64px)]">
        
        {/* LEFT COLUMN: HERO & FEATURES */}
        <div className="animate-fade-in-up flex flex-col justify-center space-y-10 lg:pr-10 pt-8 lg:pt-0">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan-light)] text-sm font-semibold tracking-wide">
              <Activity size={16} /> Beta v0.1.0
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[var(--text-primary)] to-[var(--accent-cyan-light)] font-space leading-tight drop-shadow-lg">
              {t(language, 'heroTitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-lg font-light">
              {t(language, 'heroSubtitle')}
            </p>
          </div>

          <button 
            onClick={handleHeroCTA}
            className="group relative w-fit inline-flex items-center justify-center gap-3 bg-white text-black font-bold text-lg px-8 py-4 rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan-light)] to-[var(--accent-purple-light)] opacity-0 group-hover:opacity-20 transition-opacity" />
            <Zap className="text-[var(--accent-purple)] group-hover:scale-110 transition-transform" />
            <span>{t(language, 'ctaStartTest')}</span>
          </button>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[var(--border-accent)]">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/20 flex items-center justify-center border border-[var(--accent-purple)]/30 text-[var(--accent-purple-light)]">
                <Clock size={20} />
              </div>
              <h3 className="text-white font-semibold text-sm">{t(language, 'feature1Title')}</h3>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">{t(language, 'feature1Desc')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/20 flex items-center justify-center border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan-light)]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-white font-semibold text-sm">{t(language, 'feature2Title')}</h3>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">{t(language, 'feature2Desc')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30 text-pink-400">
                <Zap size={20} />
              </div>
              <h3 className="text-white font-semibold text-sm">{t(language, 'feature3Title')}</h3>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">{t(language, 'feature3Desc')}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTH PANEL */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }} ref={authRef}>
          {/* Neon back glow for the form container */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-30 blur-2xl" />
          
          <div className="glass-card p-8 md:p-10 relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 rounded-2xl bg-[#0a0a0f]/80">
            
            {guestWarning && (
              <div className="mb-6 p-4 rounded-xl bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 flex items-start gap-3 text-sm text-[var(--accent-purple-light)] animate-fade-in-up">
                <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-tight">{t(language, 'warnGuest')}</p>
              </div>
            )}

            <div className="flex mb-8 p-1 rounded-xl bg-black/40 border border-white/5">
              {(['login', 'signup'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setGuestWarning(false); }}
                  className="flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300"
                  style={{
                    background: mode === m ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'transparent',
                    color: mode === m ? 'white' : 'var(--text-muted)',
                    boxShadow: mode === m ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  {mode === m && m === 'login' ? t(language, 'loginTab') : mode === m && m === 'signup' ? t(language, 'signupTab') : m === 'login' ? t(language, 'loginTab') : t(language, 'signupTab')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {mode === 'signup' && (
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                  <input
                    className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                    style={{ paddingLeft: '3.5rem' }}
                    type="text"
                    placeholder={t(language, 'namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              )}
              
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                <input
                  className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                  style={{ paddingLeft: '3.5rem' }}
                  type="email"
                  placeholder={t(language, 'emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                <input
                  className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                  style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder={t(language, 'passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium animate-fade-in-up text-center shadow-[0_0_15px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full relative overflow-hidden bg-white text-black font-bold text-base h-14 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple-light)] opacity-0 hover:opacity-10 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>{t(language, 'checking')}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? t(language, 'loginBtn') : t(language, 'signupBtn')}</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </div>
              </button>
            </form>

            <p className="text-center mt-6 text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
              {t(language, 'privacyNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline chevron for button without importing another lucide just for it to save a line 
// Oh wait, I imported other icons, I can just add ChevronRight to the import!
// Let me quickly define it here since I already wrote the JSX to use it:
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
