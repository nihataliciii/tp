'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { language } = useApp();
  const { currentUser, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogout = () => {
    logout();
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
    ...((mounted && currentUser?.email.toLowerCase() === 'admin@admin.com') 
      ? [{ key: 'adminPanel', href: '/admin/blog' }] 
      : []),
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-[var(--border-accent)] bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section: Logo and Brand Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={handleLinkClick}>
            <Logo className="w-9 h-9" />
            <span className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple-light)] to-[var(--accent-cyan)] font-space">
              TimePerception
            </span>
          </Link>

          {/* Right section: Links & Language for desktop */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-6 xl:gap-8 mr-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/' && pathname === '/test'); // Handling basic root if needed
                const isExactActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative font-medium transition-colors hover:text-white ${
                      isExactActive ? 'text-white' : 'text-[var(--text-secondary)]'
                    } ${item.highlight ? 'text-[var(--accent-cyan)] hover:text-[var(--accent-cyan-light)] shadow-none glow-text' : ''}`}
                  >
                    {t(language, item.key as any)}
                    {item.key === 'navAccount' && currentUser?.avatarUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentUser.avatarUrl} alt="Avatar" className="ml-2 w-7 h-7 rounded-full inline-block object-cover align-middle border border-[var(--accent-purple-light)]" />
                    )}
                    {/* Active indicator */}
                    {isExactActive && (
                      <span className="absolute -bottom-2 md:-bottom-[1.35rem] left-0 right-0 border-b-2 border-[var(--accent-purple-light)] glow-border" />
                    )}
                  </Link>
                );
              })}
            </div>
            
            {(mounted && currentUser) && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[var(--accent-purple-light)] hover:text-white transition-colors text-sm font-semibold ml-2 border border-[var(--border-accent)] px-3 py-1.5 rounded-lg hover:bg-[rgba(124,58,237,0.1)]"
              >
                <LogOut size={16} />
                {t(language, 'logoutNav' as any)}
              </button>
            )}

            <div className="pl-4 border-l border-[var(--border-accent)] ml-4">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[var(--text-primary)] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-[rgba(15,15,26,0.95)] backdrop-blur-xl border-b border-[var(--border-accent)] ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          {navItems.map((item) => {
            const isExactActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-all ${
                  isExactActive
                    ? 'bg-[rgba(124,58,237,0.15)] text-[var(--accent-cyan-light)]'
                    : 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                } ${item.highlight && !isExactActive ? 'text-[var(--accent-cyan)]' : ''}`}
              >
                {t(language, item.key as any)}
                {item.key === 'navAccount' && currentUser?.avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentUser.avatarUrl} alt="Avatar" className="ml-2 w-6 h-6 rounded-full inline-block object-cover border border-[var(--accent-cyan)]" />
                )}
              </Link>
            );
          })}
          {(mounted && currentUser) && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-3 w-full text-left rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-2"
            >
              <LogOut size={20} />
              {t(language, 'logoutNav' as any)}
            </button>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-[200] animate-fade-in-up">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-md border border-[var(--accent-cyan)]/50 text-white px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)] flex items-center gap-3">
            <CheckCircle2 className="text-[var(--accent-cyan)]" size={20} />
            <span className="font-medium text-sm">{t(language, 'logoutSuccess' as any)}</span>
          </div>
        </div>
      )}
      
      {/* Dynamic styles for glowing texts and borders */}
      <style dangerouslySetInnerHTML={{__html: `
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
        }
        .glow-border {
          box-shadow: 0 4px 10px -2px rgba(157, 0, 255, 0.8);
        }
      `}} />
    </nav>
  );
}
