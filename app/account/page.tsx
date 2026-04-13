'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import {
  User, Mail, Calendar, LogOut, Camera,
  Activity, FileCheck, Brain, LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { language } = useApp();
  const { currentUser, logout, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && !currentUser) router.push('/login');
  }, [currentUser, router, mounted]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-6 h-6 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push('/'); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/user/upload-avatar', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) updateUser(currentUser.id, { avatarUrl: data.url });
      else alert('Yükleme başarısız oldu.');
    } catch (err) {
      console.error(err);
      alert('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const tests = currentUser.testResults || [];

  /** Status badge styles — accent colors work in both themes */
  const statusStyle = (status: string) => {
    if (status === 'Normal Algı') return { background: 'rgba(245,158,11,0.12)', color: '#d97706', border: '1px solid rgba(245,158,11,0.25)' };
    if (status === 'Yavaş Algı')  return { background: 'rgba(16,185,129,0.12)',  color: '#059669', border: '1px solid rgba(16,185,129,0.25)' };
    return                               { background: 'rgba(239,68,68,0.12)',    color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' };
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)]" style={{ background: 'var(--bg-primary)' }}>
      {/* Soft decorative orbs */}
      <div className="orb orb-purple opacity-15 fixed" style={{ top: 0, right: 0, width: '22vw', height: '22vw' }} />
      <div className="orb orb-cyan opacity-15 fixed"   style={{ bottom: 0, left: 0,  width: '18vw', height: '18vw' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col gap-6 animate-fade-in-up">

        {/* ── Profile header ── */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              className="w-24 h-24 rounded-full relative overflow-hidden flex items-center justify-center border-2"
              style={{ borderColor: 'var(--border-accent)', background: 'var(--bg-card)', boxShadow: '0 0 20px var(--glow-purple)' }}
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
              ) : currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} style={{ color: 'var(--text-muted)' }} />
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.55)' }}
              >
                <Camera className="text-white mb-0.5" size={18} />
                <span className="text-xs font-semibold text-white">Değiştir</span>
              </div>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>

          {/* User info */}
          <div className="glass-card p-5 flex-1 w-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentUser.fullName}
                </h1>
                <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--accent-cyan)' }}>
                  <User size={13} /> @{currentUser.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-400"
                title={t(language, 'logoutNav' as any)}
                style={{ border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              {[
                { icon: Mail, value: currentUser.email, color: 'var(--accent-purple-light)' },
                { icon: Calendar, value: `Katılım: ${new Date(currentUser.createdAt).toLocaleDateString()}`, color: 'var(--accent-cyan)' },
              ].map(({ icon: Icon, value, color }) => (
                <div key={value} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <Icon size={14} style={{ color }} />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Test history ── */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
              Test Geçmişi
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              Toplam: {tests.length}
            </span>
          </div>

          {tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl"
              style={{ border: '2px dashed var(--border-accent)' }}>
              <Brain size={36} className="mb-3 opacity-40" style={{ color: 'var(--accent-purple)' }} />
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Henüz Bir Test Yapmadınız</h3>
              <p className="text-xs mb-5 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Zaman algısı testini tamamladığında skorların burada görünür.
              </p>
              <Link href="/test" className="btn-primary text-xs gap-2 !py-2.5 !px-5 !min-h-0 flex items-center">
                <FileCheck size={14} /> Hemen Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, index) => (
                <div
                  key={test.id || index}
                  className="p-4 rounded-xl flex flex-col gap-2 transition-all hover:border-[var(--accent-purple-light)]"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(test.date).toLocaleDateString()} · {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={statusStyle(test.status)}>
                      {test.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    <LayoutDashboard size={13} style={{ color: 'var(--accent-cyan)' }} />
                    {test.testType}
                  </h4>
                  <p className="text-base font-bold gradient-text">{test.scoreStr}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
