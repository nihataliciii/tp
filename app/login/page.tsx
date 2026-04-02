'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff, Lock, Mail, User, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

type Mode = 'login' | 'signup' | 'forgot_password';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  const switchMode = (m: Mode) => { setMode(m); setError(''); setSuccessMsg(''); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) { setError('Lütfen tüm alanları doldurun.'); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
    setLoading(false);

    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'E-posta veya şifre hatalı.'
        : err.message);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Lütfen tüm alanları doldurun.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Geçerli bir e-posta adresi girin.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; }

    setLoading(true);

    const { data, error: signupErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (signupErr) {
      setLoading(false);
      setError(signupErr.message === 'User already registered'
        ? 'Bu e-posta adresi zaten kayıtlı.'
        : signupErr.message);
      return;
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: name,
        created_at: new Date().toISOString(),
      });
    }

    setLoading(false);

    // If email confirmation is required, inform the user
    if (!data.session) {
      setSuccessMsg('Kayıt başarılı! E-posta adresinizi onaylayın, ardından giriş yapabilirsiniz.');
      switchMode('login');
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('E-posta adresinizi girin.'); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    setEmail('');
  };

  const isAuthMode = mode === 'login' || mode === 'signup';

  return (
    <div className="relative min-h-full w-full flex items-center justify-center px-4 py-12 bg-[var(--bg-primary)]">
      {/* Background orbs */}
      <div className="orb orb-purple opacity-30 animate-float-slow" style={{ top: '-10%', right: '5%', width: '40vw', height: '40vw' }} />
      <div className="orb orb-cyan opacity-25 animate-float-slower" style={{ bottom: '5%', left: '-5%', width: '30vw', height: '30vw' }} />

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-25 blur-2xl" />

        <div className="glass-card p-8 md:p-10 relative z-10 border border-white/10 rounded-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Clock size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              TimePerception
            </span>
          </div>

          {/* Tabs */}
          {isAuthMode && (
            <div className="flex mb-8 p-1 rounded-xl bg-black/40 border border-white/5">
              {(['login', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: mode === m ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                    color: mode === m ? 'white' : 'var(--text-muted)',
                    boxShadow: mode === m ? '0 4px 12px rgba(79,70,229,0.35)' : 'none',
                  }}
                >
                  {m === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              ))}
            </div>
          )}

          {/* Forgot password back button */}
          {mode === 'forgot_password' && (
            <div className="mb-8 text-center">
              <button
                onClick={() => switchMode('login')}
                className="flex items-center justify-center gap-1 text-[var(--accent-cyan)] hover:text-white text-sm font-medium mx-auto mb-4 transition-colors"
              >
                <ArrowLeft size={15} /> Girişe Dön
              </button>
              <h2 className="text-xl font-bold text-white gradient-text">Şifreyi Sıfırla</h2>
            </div>
          )}

          <form
            onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPass}
            className="flex flex-col gap-4"
          >
            {/* Signup: Full name */}
            {mode === 'signup' && (
              <div className="relative group">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                <input
                  className="input-field h-12"
                  style={{ paddingLeft: '3rem' }}
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            {/* Login identifier / Signup email / Forgot email */}
            {(mode === 'login' || mode === 'forgot_password') && (
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                <input
                  className="input-field h-12"
                  style={{ paddingLeft: '3rem' }}
                  type={mode === 'login' ? 'text' : 'email'}
                  placeholder={mode === 'login' ? 'E-posta adresi' : 'E-posta adresiniz'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                <input
                  className="input-field h-12"
                  style={{ paddingLeft: '3rem' }}
                  type="email"
                  placeholder="E-posta adresi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password */}
            {isAuthMode && (
              <div className="flex flex-col items-end">
                <div className="relative w-full group">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                  <input
                    className="input-field h-12 w-full"
                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-xs font-medium text-[var(--accent-cyan)] hover:text-white mt-2 transition-colors"
                  >
                    Şifremi unuttum
                  </button>
                )}
              </div>
            )}

            {/* Error / Success banners */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden h-12 rounded-xl font-bold text-sm bg-white text-black
                         shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
                         transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 mt-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 hover:opacity-10 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Lütfen bekleyin…
                  </>
                ) : (
                  <>
                    {mode === 'login' ? 'Giriş Yap' : mode === 'signup' ? 'Hesap Oluştur' : 'Sıfırlama Linki Gönder'}
                    <ChevronRight size={16} />
                  </>
                )}
              </span>
            </button>
          </form>

          {isAuthMode && (
            <p className="text-center mt-5 text-xs text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
              Devam ederek Gizlilik Politikamızı ve Kullanım Şartlarımızı kabul etmiş olursunuz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
