'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  User, Mail, Calendar, LogOut, Camera, Activity,
  FileCheck, Brain, LayoutDashboard, Trash2,
} from 'lucide-react';
import Link from 'next/link';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
}

interface TestResult {
  id: string;
  score: number;
  ratio: number;
  status: string;
  test_type: string;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  const loadData = useCallback(async (uid: string) => {
    const [{ data: prof }, { data: res }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase
        .from('test_results')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false }),
    ]);
    if (prof) setProfile(prof);
    setResults(res ?? []);
  }, [supabase]);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return; }
      setUser(data.user);
      loadData(data.user.id);
    });
  }, [router, supabase, loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);

      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      setProfile((prev) => prev ? { ...prev, avatar_url: urlData.publicUrl } : prev);
    } catch (err) {
      console.error(err);
      alert('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResult = async (id: string) => {
    await supabase.from('test_results').delete().eq('id', id);
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-full w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Kullanıcı';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-full bg-white">
      {/* Page header */}
      <div className="border-b border-gray-100 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Hesabım
        </h1>
        <p className="text-sm text-gray-500 mt-1">Profil bilgileriniz ve test geçmişiniz</p>
      </div>

      <div className="px-8 py-8 max-w-4xl mx-auto flex flex-col gap-8">

        {/* Profile card */}
        <div className="saas-card p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={20} className="text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {displayName}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} className="text-indigo-400" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} className="text-indigo-400" />
                      Katılım: {memberSince}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                >
                  <LogOut size={15} />
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test history */}
        <div className="saas-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <Activity size={20} className="text-indigo-500" />
              Test Geçmişi
            </h3>
            <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              {results.length} test
            </span>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <Brain size={40} className="text-indigo-300 mb-3" />
              <h4 className="text-base font-semibold text-gray-700 mb-1">Henüz test yapmadınız</h4>
              <p className="text-sm text-gray-400 max-w-xs mb-5">
                Zaman algısı testini tamamladığınızda sonuçlar burada görünecek.
              </p>
              <Link
                href="/test"
                className="saas-btn flex items-center gap-2"
              >
                <FileCheck size={16} /> Hemen Teste Başla
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Test</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Tarih</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Skor</th>
                    <th className="pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 group transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <LayoutDashboard size={14} className="text-indigo-400" />
                          <span className="font-medium text-gray-800">{r.test_type}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                        <span className="text-gray-400 ml-1">
                          {new Date(r.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-bold text-gray-900">{Math.round(r.score * 100)}%</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${
                          r.status === 'Normal Algı'  ? 'bg-amber-50 text-amber-600' :
                          r.status === 'Yavaş Algı'   ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDeleteResult(r.id)}
                          className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
