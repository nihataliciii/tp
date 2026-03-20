'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { User, Mail, Calendar, LogOut, Camera, Activity, FileCheck, Brain, LayoutDashboard, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { language } = useApp();
  const { currentUser, logout, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, router, mounted]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        updateUser(currentUser.id, { avatarUrl: data.url });
      } else {
        alert('Yükleme başarısız oldu.');
      }
    } catch (err) {
      console.error(err);
      alert('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const tests = currentUser.testResults || [];

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#050508] relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="orb orb-purple opacity-20 animate-float-slow absolute top-0 right-0 w-[500px] h-[500px]" />
      <div className="orb orb-cyan opacity-20 animate-float-slower absolute bottom-0 left-0 w-[500px] h-[500px]" />
      
      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-8 animate-fade-in-up">
        
        {/* HEADER & PROFILE OVERVIEW */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar Upload Core */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0a0a0f] shadow-[0_0_30px_rgba(124,58,237,0.3)] relative overflow-hidden bg-black/60 flex items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
              ) : currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-[var(--text-muted)]" />
              )}
              
              {/* Overlay Trigger */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
              >
                <Camera className="text-white mb-1" size={24} />
                <span className="text-xs font-bold text-white">Değiştir</span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>

          {/* User Meta */}
          <div className="flex-1 space-y-4 w-full glass-card p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--text-muted)]">
                  {currentUser.fullName}
                </h1>
                <p className="text-[var(--accent-cyan)] font-medium inline-flex items-center gap-1.5 mt-1">
                  <User size={15} /> @{currentUser.username}
                </p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20"
                title={t(language, 'logoutNav' as any)}
              >
                <LogOut size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-[var(--text-secondary)] bg-black/30 p-3 rounded-lg border border-white/5">
                <Mail size={18} className="text-[var(--accent-purple-light)]" />
                <span className="text-sm font-medium">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--text-secondary)] bg-black/30 p-3 rounded-lg border border-white/5">
                <Calendar size={18} className="text-[var(--accent-cyan)]" />
                <span className="text-sm font-medium">Katılım: {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TEST HISTORY MODULE */}
        <div className="glass-card p-6 md:p-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="text-[var(--accent-cyan)]" size={28} />
              Test Geçmişi
            </h2>
            <div className="text-sm font-semibold text-[var(--text-muted)] bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
              Toplam Test: {tests.length}
            </div>
          </div>

          {tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
              <Brain className="text-[var(--accent-purple)] opacity-50 mb-4" size={48} />
              <h3 className="text-lg font-bold text-white mb-2">Henüz Bir Test Yapmadınız</h3>
              <p className="text-[var(--text-muted)] max-w-sm mb-6">
                Uygulamadaki zaman algısı veya diğer testleri çözdükçe geçmişiniz ve skorlarınız burada görünecektir.
              </p>
              <Link 
                href="/test"
                className="bg-white text-black font-bold px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <FileCheck size={18} /> Hemen Teste Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, index) => (
                <div 
                  key={test.id || index}
                  className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-[var(--accent-purple-light)]/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] bg-white/5 px-2 py-1 rounded">
                      {new Date(test.date).toLocaleDateString()} • {new Date(test.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${
                      test.status === 'Normal Algı' ? 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b30]' :
                      test.status === 'Yavaş Algı' ? 'bg-[#10b98120] text-[#10b981] border border-[#10b98130]' :
                      'bg-[#ef444420] text-[#ef4444] border border-[#ef444430]'
                    }`}>
                      {test.status}
                    </span>
                  </div>
                  <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                    <LayoutDashboard size={14} className="text-[var(--accent-cyan)]" />
                    {test.testType}
                  </h4>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--text-muted)]">
                    {test.scoreStr}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
