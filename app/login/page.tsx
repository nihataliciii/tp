'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'signup' | 'forgot_password';

export default function LoginPage() {
  const { setStage, setUser, language } = useApp();
  const { login, register, resetPassword } = useAuthStore();
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>('login');
  
  // Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) { setError(t(language, 'fillFields')); return; }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network delay
    
    const res = login(identifier, password);
    if (!res.success) {
      setError(t(language, res.error === 'user_not_found' ? 'userNotFound' : 'wrongPassword'));
      setLoading(false);
      return;
    }
    
    setUser({ name: res.user!.fullName, email: res.user!.email });
    setStage('survey');
    router.push('/');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !username || !email || !password) { setError(t(language, 'fillFields')); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t(language, 'invalidEmail'));
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network delay
    
    const res = register(name, username, email, password);
    if (!res.success) {
      setError(t(language, res.error === 'username_taken' ? 'usernameTaken' : 'emailTaken'));
      setLoading(false);
      return;
    }
    
    // Auto-login after signup
    const loginRes = login(username, password);
    if (loginRes.success) {
      setUser({ name: loginRes.user!.fullName, email: loginRes.user!.email });
      setStage('survey');
      router.push('/');
    }
  };

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) { setError(t(language, 'fillFields')); return; }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    
    const res = resetPassword(email);
    setLoading(false);
    
    if (!res.success) {
      setError(t(language, 'userNotFound'));
    } else {
      setSuccessMsg(t(language, 'resetPassSuccess'));
      setEmail(''); // clear field
    }
  };

  const isAuthMode = mode === 'login' || mode === 'signup';

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-x-hidden flex justify-center items-center px-4 py-12">
      <div className="orb orb-purple opacity-40 animate-float-slow" style={{ top: '10%', right: '10%', width: '40vw', height: '40vw' }} />
      <div className="orb orb-cyan opacity-40 animate-float-slower" style={{ bottom: '20%', left: '5%', width: '30vw', height: '30vw' }} />

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Neon back glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-30 blur-2xl" />
        
        <div className="glass-card p-8 md:p-10 relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 rounded-2xl bg-[#0a0a0f]/80">
          
          {/* Top Tabs (Only if Login or Signup) */}
          {isAuthMode && (
            <div className="flex mb-8 p-1 rounded-xl bg-black/40 border border-white/5">
              {(['login', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeSwitch(m)}
                  className="flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300"
                  style={{
                    background: mode === m ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'transparent',
                    color: mode === m ? 'white' : 'var(--text-muted)',
                    boxShadow: mode === m ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  {m === 'login' ? t(language, 'loginTab') : t(language, 'signupTab')}
                </button>
              ))}
            </div>
          )}

          {/* Forgot Password Header */}
          {mode === 'forgot_password' && (
            <div className="mb-8 text-center animate-fade-in-up">
              <button 
                onClick={() => handleModeSwitch('login')}
                className="flex items-center justify-center gap-1 text-[var(--accent-cyan)] hover:text-white transition-colors text-sm font-medium mx-auto mb-4"
              >
                <ArrowLeft size={16} /> {t(language, 'backToLogin')}
              </button>
              <h2 className="text-2xl font-bold text-white gradient-text">{t(language, 'resetPassTitle')}</h2>
            </div>
          )}

          <form 
            onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPass} 
            className="flex flex-col gap-5 relative z-10"
          >
            {/* SIGNUP FIELDS */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-5 animate-fade-in-up">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                  <input
                    className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                    style={{ paddingLeft: '3.5rem' }}
                    type="text"
                    placeholder={t(language, 'fullNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                  <input
                    className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                    style={{ paddingLeft: '3.5rem' }}
                    type="text"
                    placeholder={t(language, 'usernamePlaceholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                  <input
                    className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                    style={{ paddingLeft: '3.5rem' }}
                    type="email"
                    placeholder={t(language, 'emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* LOGIN IDENTIFIER */}
            {mode === 'login' && (
              <div className="relative group animate-fade-in-up">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                <input
                  className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                  style={{ paddingLeft: '3.5rem' }}
                  type="text"
                  placeholder={t(language, 'emailOrUserPlaceholder')}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            )}

            {/* FORGOT PASS IDENTIFIER */}
            {mode === 'forgot_password' && (
              <div className="relative group animate-fade-in-up">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                <input
                  className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14"
                  style={{ paddingLeft: '3.5rem' }}
                  type="email"
                  placeholder={t(language, 'emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            
            {/* PASSWORD FIELD (Login/Signup) */}
            {isAuthMode && (
              <div className="flex flex-col items-end animate-fade-in-up">
                <div className="relative w-full group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan-light)] transition-colors" />
                  <input
                    className="input-field bg-black/40 border-white/10 hover:border-white/20 focus:border-[var(--accent-cyan)] focus:bg-black/60 transition-all text-white placeholder-[var(--text-muted)] font-medium h-14 w-full"
                    style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                    type={showPass ? 'text' : 'password'}
                    placeholder={t(language, 'passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors p-1"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => handleModeSwitch('forgot_password')} 
                    className="text-xs font-semibold text-[var(--accent-cyan)] hover:text-white mt-3 transition-colors underline underline-offset-4 decoration-white/20"
                  >
                    {t(language, 'forgotPassword')}
                  </button>
                )}
              </div>
            )}

            {/* FEEDBACK BANNERS */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium text-center shadow-[0_0_15px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2 animate-fade-in-up">
                <ShieldCheck size={16} className="flex-shrink-0" /> <span className="text-left">{error}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm font-medium text-center shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 animate-fade-in-up">
                <CheckCircle2 size={16} className="flex-shrink-0" /> <span className="text-left">{successMsg}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-white text-black font-bold text-base h-14 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2 animate-fade-in-up"
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
                    <span>
                      {mode === 'login' ? t(language, 'loginBtn') : mode === 'signup' ? t(language, 'signupBtn') : t(language, 'resetPassBtn')}
                    </span>
                    <ChevronRight size={18} />
                  </>
                )}
              </div>
            </button>
          </form>

          {isAuthMode && (
            <p className="text-center mt-6 text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto animate-fade-in-up">
              {t(language, 'privacyNote')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
