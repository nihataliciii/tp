'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { Brain, Eye, EyeOff, Zap, Lock, Mail, User } from 'lucide-react';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const { setStage, setUser, language } = useApp();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sistemde kayıtlı mock veritabanı e-postaları
  const REGISTERED_EMAILS = ['test@test.com', 'admin@admin.com', 'demo@test.com'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError(t(language, 'fillFields')); return; }
    if (mode === 'signup' && !name) { setError(t(language, 'enterName')); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t(language, 'invalidEmail'));
      return;
    }
    
    // Yalnızca kayıtlı olan e-postaların giriş yapmasına izin ver
    if (mode === 'login' && !REGISTERED_EMAILS.includes(email.toLowerCase())) {
      setError(t(language, 'unregisteredEmail'));
      return;
    }

    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1200));
    setUser({ name: mode === 'signup' ? name : email.split('@')[0], email });
    setStage('survey');
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none" />

      <div className="min-h-full w-full flex items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-float"
               style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
            <Brain size={30} color="white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">TimePerception</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {t(language, 'authSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 relative z-20 shadow-2xl">
          {/* Tab toggle */}
          <div className="flex mb-6 p-1 rounded-xl" style={{ background: 'rgba(13,13,20,0.8)' }}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 4px 15px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {mode === m && m === 'login' ? t(language, 'loginTab') : mode === m && m === 'signup' ? t(language, 'signupTab') : m === 'login' ? t(language, 'loginTab') : t(language, 'signupTab')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  style={{ paddingLeft: '3rem' }}
                  type="text"
                  placeholder={t(language, 'namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                type="email"
                placeholder={t(language, 'emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                type={showPass ? 'text' : 'password'}
                placeholder={t(language, 'passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-center py-2 px-3 rounded-lg" style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t(language, 'checking')}</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>{mode === 'login' ? t(language, 'loginBtn') : t(language, 'signupBtn')}</span>
                </>
              )}
            </button>
          </form>

          {/* Info note */}
          <p className="text-center mt-5 text-xs whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
            {t(language, 'privacyNote')}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          {[t(language, 'featureScientific'), t(language, 'featureBlindTest'), t(language, 'featurePersonal')].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-purple-light)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              {f}
            </span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
