'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Brain, Cpu, Dna } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function LoadingScreen() {
  const { setStage, language } = useApp();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 1.5;
      });
    }, 50);

    // Message cycling
    const messageInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % 5);
    }, 750);

    // Navigate after 4s
    const timeout = setTimeout(() => {
      setStage('test');
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(timeout);
    };
  }, [setStage]);

  const loadingMessages = [
    { icon: Brain, text: t(language, 'loadingMsg0') },
    { icon: Cpu, text: t(language, 'loadingMsg1') },
    { icon: Dna, text: t(language, 'loadingMsg2') },
    { icon: Brain, text: t(language, 'loadingMsg3') },
    { icon: Cpu, text: t(language, 'loadingMsg4') },
  ];

  const msg = loadingMessages[messageIndex];
  const Icon = msg.icon;

  return (
    <div
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a16 0%, #050508 100%)' }}
    >
      <div className="orb orb-purple" style={{ opacity: 0.2 }} />

      <div className="min-h-full w-full flex items-center justify-center p-4 py-12 relative z-10">
        <div className="text-center w-full max-w-sm animate-fade-in-up mx-auto">
        {/* Central orb spinner */}
        <div className="relative mx-auto mb-10 w-28 h-28">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'transparent',
              borderTopColor: '#7c3aed',
              borderRightColor: '#7c3aed40',
              animationDuration: '1.5s',
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-3 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'transparent',
              borderBottomColor: '#06b6d4',
              borderLeftColor: '#06b6d440',
              animationDuration: '2s',
              animationDirection: 'reverse',
            }}
          />
          {/* Core */}
          <div
            className="absolute inset-6 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: 'linear-gradient(135deg, #7c3aed30, #06b6d430)', border: '1px solid #7c3aed50' }}
          >
            <Brain size={22} style={{ color: '#a855f7' }} />
          </div>
        </div>

        {/* Message */}
        <div className="h-8 mb-2 flex items-center justify-center gap-2">
          <Icon size={15} style={{ color: '#a855f7' }} />
          <p
            className="text-base font-medium transition-all duration-300"
            style={{ color: 'var(--text-secondary)' }}
          >
            {msg.text}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="mt-6 mx-auto w-64 h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--border-accent)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 10px rgba(124,58,237,0.7)',
            }}
          />
        </div>

        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {t(language, 'loadingCompleted', { percent: Math.min(Math.round(progress), 100) })}
        </p>

        {/* Data points */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: t(language, 'loadingDataPoint'), value: '47K+' },
            { label: t(language, 'loadingParticipant'), value: '12.3K' },
            { label: t(language, 'loadingCorrelation'), value: 'p<0.001' },
          ].map((item) => (
            <div
              key={item.label}
              className="py-3 px-2 rounded-xl text-center"
              style={{ background: 'rgba(18,18,31,0.8)', border: '1px solid var(--border-accent)' }}
            >
              <p className="text-base font-bold gradient-text">{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
