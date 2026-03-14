'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Brain, Zap, TrendingUp, TrendingDown, Minus, ExternalLink, RotateCcw } from 'lucide-react';

// ─── Analysis Engine ──────────────────────────────────────────────────────────

interface Analysis {
  actualMeanRatio: number;     // Average of actual/target across 5 rounds
  expectedTPR: number;         // From survey
  deltaRatio: number;          // actualMean - expectedTPR
  profileCategory: 'overperform' | 'match' | 'underperform';
  headline: string;
  subtext: string;
  color: string;
  icon: typeof Brain;
}

function analyzeResults(
  rounds: ReturnType<typeof useApp>['roundResults'],
  expectedTPR: number
): Analysis {
  if (!rounds.length) {
    return {
      actualMeanRatio: 1,
      expectedTPR,
      deltaRatio: 0,
      profileCategory: 'match',
      headline: 'Sonuç hesaplanamadı.',
      subtext: 'Lütfen testi tekrarlayın.',
      color: '#7c3aed',
      icon: Brain,
    };
  }

  // Mean of actual/target ratios (>1 means went overtime = slow perception, <1 = fast perception)
  const meanRatio = rounds.reduce((s, r) => s + r.errorRatio, 0) / rounds.length;

  // Expected: low TPR means time feels fast → user should STOP EARLY (ratio < 1)
  // expectedTPR 1.0 = neutral, 0.8 = time feels fast (shorter stop expected)
  const expectedStopRatio = expectedTPR; // mirrored: low TPR → user stops early
  const delta = meanRatio - expectedStopRatio;

  let category: Analysis['profileCategory'];
  let headline: string;
  let subtext: string;
  let color: string;
  let icon: typeof Brain;

  if (delta < -0.12) {
    // Stopped much earlier than expected → time felt much faster than profile predicts
    category = 'underperform';
    headline = 'Zaman Algın Profilinden de Hızlı Akıyor';
    subtext =
      'Odak süren, yaş/uyku/ekran süresi profilindeki birinden beklenenden çok daha az! Zaman senin için olağandışı bir hızda akıyor. Dopamin reseptörlerin yoğun yük altında — bu bir alarm sinyali.';
    color = '#ef4444';
    icon = TrendingDown;
  } else if (delta > 0.12) {
    // Stopped later than expected → time felt slower (better focus)
    category = 'overperform';
    headline = 'Zaman Algın Profilinden Daha Sağlıklı';
    subtext =
      'Profilindeki biri için beklenen değerin üzerine çıktın. Odak kaliten tahminlerin üzerinde — ancak bu sürdürülebilir mi? Verilerini korumak için düzenli egzersiz ve uyku tutarlılığına dikkat et.';
    color = '#10b981';
    icon = TrendingUp;
  } else {
    // Within expected range
    category = 'match';
    headline = 'Zaman Algın Profilinle Eşleşiyor';
    subtext =
      'Sonuçların anket verilerinle tutarlı. İyi haber: bu oran hâlâ optimize edilebilir. Kısa video süresini 30 dakika azaltmak tek başına zaman algı hassasiyetini %8 artırabilir.';
    color = '#f59e0b';
    icon = Minus;
  }

  return {
    actualMeanRatio: Math.round(meanRatio * 1000) / 1000,
    expectedTPR,
    deltaRatio: Math.round(delta * 1000) / 1000,
    profileCategory: category,
    headline,
    subtext,
    color,
    icon,
  };
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{ background: '#1a1a2e', border: '1px solid #2e2e55', color: 'var(--text-primary)' }}
      >
        <p className="font-bold mb-1">Tur {d.round}</p>
        <p style={{ color: 'var(--text-muted)' }}>
          Hedef: <strong style={{ color: 'white' }}>{d.target}s</strong>
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Gerçek: <strong style={{ color: 'white' }}>{d.actual}s</strong>
        </p>
        <p style={{ color: payload[0].fill }}>
          Hata: {d.error > 0 ? '+' : ''}{d.error}%
        </p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const { roundResults, expectedTPR, user, resetApp } = useApp();

  const tpr = expectedTPR ?? 1.0;
  const analysis = useMemo(() => analyzeResults(roundResults, tpr), [roundResults, tpr]);

  const chartData = roundResults.map((r) => ({
    round: r.round,
    target: r.targetSeconds,
    actual: r.actualSeconds,
    error: r.errorPercent,
    ratio: r.errorRatio,
  }));

  const avgError = roundResults.length
    ? roundResults.reduce((s, r) => s + Math.abs(r.errorPercent), 0) / roundResults.length
    : 0;

  const Icon = analysis.icon;

  return (
    <div className="min-h-dvh flex flex-col px-4 py-8 relative">
      <div className="orb orb-purple" style={{ opacity: 0.2 }} />
      <div className="orb orb-cyan" style={{ opacity: 0.12 }} />
      <div className="bg-grid fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {user?.name} için sonuçlar
          </p>
          <h1 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            Zaman Algısı Analizi
          </h1>
        </div>

        {/* Main result card */}
        <div
          className="glass-card p-6"
          style={{
            borderColor: `${analysis.color}40`,
            boxShadow: `0 0 30px ${analysis.color}20`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${analysis.color}20` }}
            >
              <Icon size={22} style={{ color: analysis.color }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: analysis.color }}>
              {analysis.headline}
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {analysis.subtext}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Ortalama Hata',
              value: `±${avgError.toFixed(1)}%`,
              sub: 'Tahmin sapman',
              color: analysis.color,
            },
            {
              label: 'Algı Oranı',
              value: `${analysis.actualMeanRatio.toFixed(2)}x`,
              sub: 'Gerçek / Hedef',
              color: '#7c3aed',
            },
            {
              label: 'Profil Skoru',
              value: `${(tpr * 100).toFixed(0)}/100`,
              sub: 'Beklenen oran',
              color: '#06b6d4',
            },
            {
              label: 'Test Turları',
              value: `${roundResults.length}/5`,
              sub: 'Tamamlanan',
              color: '#10b981',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-4 text-center"
              style={{ borderColor: `${stat.color}30` }}
            >
              <p
                className="text-2xl font-black"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-secondary)' }}>
            5 Tur Performans Grafiği — Hata % (Hedeften Sapma)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="round"
                tick={{ fill: '#5a5a7a', fontSize: 11 }}
                tickFormatter={(v) => `T${v}`}
              />
              <YAxis
                tick={{ fill: '#5a5a7a', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#ffffff30" strokeWidth={1} />
              <ReferenceLine
                y={10}
                stroke="#f59e0b40"
                strokeDasharray="4 4"
                label={{ value: '+10%', fill: '#f59e0b', fontSize: 10, position: 'right' }}
              />
              <ReferenceLine
                y={-10}
                stroke="#f59e0b40"
                strokeDasharray="4 4"
                label={{ value: '-10%', fill: '#f59e0b', fontSize: 10, position: 'right' }}
              />
              <Bar dataKey="error" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => {
                  const abs = Math.abs(entry.error);
                  const color = abs <= 10 ? '#10b981' : abs <= 25 ? '#f59e0b' : '#ef4444';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center">
            {[
              { color: '#10b981', label: 'İyi (≤10%)' },
              { color: '#f59e0b', label: 'Orta (≤25%)' },
              { color: '#ef4444', label: 'Yüksek (>25%)' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Round detail table */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-secondary)' }}>
            Tur Detayları
          </h3>
          <div className="flex flex-col gap-2">
            {roundResults.map((r) => {
              const abs = Math.abs(r.errorPercent);
              const color = abs <= 10 ? '#10b981' : abs <= 25 ? '#f59e0b' : '#ef4444';
              return (
                <div
                  key={r.round}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                  style={{ background: 'rgba(13,13,20,0.6)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: `${color}20`, color }}
                    >
                      {r.round}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Hedef: <strong style={{ color: 'white' }}>{r.targetSeconds}s</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Gerçek: <strong style={{ color: 'white' }}>{r.actualSeconds}s</strong>
                    </span>
                    <span className="ml-3 text-xs font-semibold" style={{ color }}>
                      {r.errorPercent > 0 ? '+' : ''}{r.errorPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Science note */}
        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{
            background: 'rgba(124,58,237,0.07)',
            border: '1px solid rgba(124,58,237,0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: '#a855f7' }}>Nasıl yorumlamalısın?</strong>
          <br />
          Pozitif hata (%) → Hedeften geç durdurdun → Zaman sana yavaş geçti.
          <br />
          Negatif hata (%) → Hedeften erken durdurdun → Zaman sana hızlı geçti.
          <br />
          Ekran süresi ve kısa video tüketimi yüksek bireyler sistematik olarak erken durduruyor
          (Montag et al., 2021).
        </div>

        {/* CTA */}
        <div
          className="p-6 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          <h3 className="text-lg font-bold mb-2 gradient-text">Odağını Geri Kazan</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Sana özel Pomodoro programı, ekran süresi planı ve nörobilişsel egzersizler
            uygulamada seni bekliyor.
          </p>
          <button
            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 mb-3"
            onClick={() => alert('Uygulama yakında! 🚀')}
          >
            <Zap size={18} />
            Sana Özel Pomodoro Programını Almak İçin Uygulamaya Geç
            <ExternalLink size={14} />
          </button>
          <button
            onClick={resetApp}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            Testi Yeniden Yap
          </button>
        </div>
      </div>
    </div>
  );
}
