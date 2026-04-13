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
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="w-full flex flex-col" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto w-full px-4 pb-16 flex flex-col gap-6 animate-fade-in-up">

        {/* ── Profile header ── */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              className="w-24 h-24 rounded-full relative overflow-hidden flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              ) : currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-400 dark:text-slate-500" />
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer bg-black/50"
              >
                <Camera className="text-white mb-0.5" size={18} />
                <span className="text-xs font-semibold text-white">Değiştir</span>
              </div>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>

          {/* User info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex-1 w-full shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-700 dark:text-white">
                  {currentUser.fullName}
                </h1>
                <p className="text-sm mt-0.5 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <User size={13} /> @{currentUser.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                title={t(language, 'logoutNav' as any)}
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                <Mail size={14} className="text-indigo-500" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                <Calendar size={14} className="text-cyan-500" />
                <span>Katılım: {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Test history ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-slate-700 dark:text-white">
              <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
              Test Geçmişi
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Toplam: {tests.length}
            </span>
          </div>

          {tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Brain size={36} className="mb-3 text-slate-300 dark:text-slate-600" />
              <h3 className="text-sm font-bold mb-1 text-slate-700 dark:text-white">Henüz Bir Test Yapmadınız</h3>
              <p className="text-xs mb-5 max-w-xs text-slate-500 dark:text-slate-400">
                Zaman algısı testini tamamladığında skorların burada görünür.
              </p>
              <Link href="/test" className="btn-primary text-xs gap-2 !py-2.5 !px-5 !min-h-0 flex items-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                <FileCheck size={14} /> Hemen Başla
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, index) => (
                <div
                  key={test.id || index}
                  className="p-4 rounded-xl flex flex-col gap-2 transition-all hover:border-indigo-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(test.date).toLocaleDateString()} · {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      test.status === 'Normal Algı' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-500/20' :
                      test.status === 'Yavaş Algı' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20' :
                      'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-500 border-red-200 dark:border-red-500/20'
                    }`}>
                      {test.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                    <LayoutDashboard size={13} className="text-indigo-500 dark:text-indigo-400" />
                    {test.testType}
                  </h4>
                  <p className="text-base font-bold text-slate-700 dark:text-white">{test.scoreStr}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
