'use client';

import { useApp, ThemeMode } from '@/lib/AppContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

const OPTIONS: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Açık' },
  { value: 'auto', icon: Monitor, label: 'Otomatik' },
  { value: 'dark', icon: Moon, label: 'Koyu' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a skeleton to prevent hydration mismatch
    return (
      <div className="flex items-center gap-1 p-1 bg-transparent border-none w-[100px] h-9">
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 p-1 bg-transparent border-none"
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
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 border-none ${
              isActive
                ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white shadow-sm'
                : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
