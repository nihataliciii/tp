'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, CheckCircle2, Timer } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { language } = useApp();
  const { currentUser, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  React.useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    router.push('/');
  };

  type NavItem = { key: string; href: string; highlight?: boolean };
  const navItems: NavItem[] = [
    { key: 'navHome', href: '/' },
    { key: 'navTest', href: '/test', highlight: true },
    { key: 'navBlog', href: '/blog' },
    { key: 'navPomodoro', href: '/pomodoro' },
    (mounted && currentUser) 
      ? { key: 'navAccount', href: '/account' }
      : { key: 'loginTab', href: '/login' },
    { key: 'navContact', href: '/contact' },
    { key: 'navForum', href: '/forum' },
    ...((mounted && currentUser?.email.toLowerCase() === 'admin@admin.com') 
      ? [{ key: 'adminPanel', href: '/admin/blog' }] 
      : []),
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-300 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center h-16 gap-4">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-4 group" onClick={handleLinkClick}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Timer size={16} />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase text-slate-700 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                TimePerception
              </span>
            </Link>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-10 px-8 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {navItems.map((item) => {
                const isExactActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative font-semibold transition-all px-3 py-1.5 rounded-md text-sm whitespace-nowrap border-none bg-transparent ${
                      isExactActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                    } ${item.highlight && !isExactActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  >
                    {t(language, item.key as any)}
                    {item.key === 'navAccount' && currentUser?.avatarUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentUser.avatarUrl} alt="Avatar" className="ml-1 w-5 h-5 rounded-full inline-block object-cover align-middle border border-slate-200 dark:border-slate-700" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="hidden lg:flex items-center gap-1 ml-auto shrink-0">
              <ThemeToggle />
              <LanguageSelector />
              {(mounted && currentUser) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-semibold px-3 py-1.5 rounded-md border-none ml-1"
                >
                  <LogOut size={16} />
                  <span>{t(language, 'logoutNav' as any)}</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden ml-auto z-[101]">
              <LanguageSelector />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-1.5 transition-colors border-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop (fully covers page to prevent overlapping) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white dark:bg-slate-950 lg:hidden overflow-y-auto pt-16">
          <div className="px-4 py-6 flex flex-col gap-1">
            {navItems.map((item) => {
              const isExactActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-all flex items-center border-none ${
                    isExactActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  } ${item.highlight && !isExactActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                >
                  {t(language, item.key as any)}
                  {item.key === 'navAccount' && currentUser?.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentUser.avatarUrl} alt="Avatar" className="ml-2 w-6 h-6 rounded-full inline-block object-cover border border-slate-200 dark:border-slate-700" />
                  )}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center px-2">
              <ThemeToggle />
              {(mounted && currentUser) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-none"
                >
                  <LogOut size={18} />
                  {t(language, 'logoutNav' as any)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-[200] animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={18} />
            <span className="font-medium text-sm">{t(language, 'logoutSuccess' as any)}</span>
          </div>
        </div>
      )}
    </>
  );
}
