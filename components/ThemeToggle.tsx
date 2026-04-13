'use client';

import { useApp, ThemeMode } from '@/lib/AppContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const OPTIONS: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Açık' },
  { value: 'auto', icon: Monitor, label: 'Otomatik' },
  { value: 'dark', icon: Moon, label: 'Koyu' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useApp();

  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-xl border border-[var(--border-accent)]"
      style={{ background: 'var(--bg-card)' }}
      role="group"
      aria-label="Tema seçimi"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            title={label}
            aria-pressed={isActive}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
            style={{
              background: isActive
                ? 'linear-gradient(135deg, var(--accent-purple), #5b21b6)'
                : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 12px var(--glow-purple)' : 'none',
            }}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
