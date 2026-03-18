'use client';

import { useApp } from '@/lib/AppContext';
import { Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative z-50 animate-fade-in-up" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-sm font-medium transition-all hover:bg-[rgba(26,26,46,0.9)]"
        style={{ color: 'var(--text-primary)', border: '1px solid var(--border-accent)' }}
      >
        <Globe size={16} style={{ color: 'var(--accent-cyan)' }} />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline-block">{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 glass-card p-2 shadow-2xl overflow-hidden rounded-xl border border-[var(--border-accent)] flex flex-col gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 text-sm text-left rounded-lg transition-colors hover:bg-[rgba(124,58,237,0.15)]"
              style={{
                color: language === lang.code ? 'var(--accent-cyan-light)' : 'var(--text-primary)',
                background: language === lang.code ? 'rgba(124,58,237,0.2)' : 'transparent',
              }}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
