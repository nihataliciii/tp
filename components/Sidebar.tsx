'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, Timer, BarChart2, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
  { href: '/', label: 'Bugün', icon: Home },
  { href: '/test', label: 'Zaman Algısı Testi', icon: Clock },
  { href: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { href: '/istatistikler', label: 'İstatistikler', icon: BarChart2 },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Clock size={20} />
        </div>
        <span className="sidebar-logo-text">TimePerception</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-item${active ? ' sidebar-item-active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {user ? (
          <>
            <Link
              href="/account"
              className={`sidebar-item${pathname === '/account' ? ' sidebar-item-active' : ''}`}
            >
              <User size={18} />
              <span className="truncate">{user.email?.split('@')[0]}</span>
            </Link>
            <button onClick={handleLogout} className="sidebar-item sidebar-item-logout">
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </>
        ) : (
          <Link href="/login" className="sidebar-item">
            <User size={18} />
            <span>Giriş Yap</span>
          </Link>
        )}
        <Link href="/admin/blog" className="sidebar-item">
          <Settings size={18} />
          <span>Admin</span>
        </Link>
      </div>
    </aside>
  );
}
