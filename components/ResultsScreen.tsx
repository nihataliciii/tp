'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { t, Language } from '@/lib/i18n';
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
  expectedTPR: number,
  language: Language
): Analysis {
  if (!rounds.length) {
    return {
      actualMeanRatio: 1,
      expectedTPR,
      deltaRatio: 0,
      profileCategory: 'match',
      headline: t(language, 'resultsCalcError'),
      subtext: t(language, 'resultsRepeatTest'),
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
    category = 'underperform';
    headline = t(language, 'resultsUnderHeadline');
    subtext = t(language, 'resultsUnderSub');
    color = '#ef4444';
    icon = TrendingDown;
  } else if (delta > 0.12) {
    category = 'overperform';
    headline = t(language, 'resultsOverHeadline');
    subtext = t(language, 'resultsOverSub');
    color = '#10b981';
    icon = TrendingUp;
  } else {
    category = 'match';
    headline = t(language, 'resultsMatchHeadline');
    subtext = t(language, 'resultsMatchSub');
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

const CustomTooltip = ({ active, payload, language }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{ background: '#1a1a2e', border: '1px solid #2e2e55', color: 'var(--text-primary)' }}
      >
        <p className="font-bold mb-1">{t(language || 'tr', 'resultsTooltipRound', { round: d.round })}</p>
        <p style={{ color: 'var(--text-muted)' }}>
          {t(language || 'tr', 'resultsRoundTarget')} <strong style={{ color: 'white' }}>{d.target}s</strong>
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          {t(language || 'tr', 'resultsRoundActual')} <strong style={{ color: 'white' }}>{d.actual}s</strong>
        </p>
        <p style={{ color: payload[0].fill }}>
          {t(language || 'tr', 'resultsTooltipError')} {d.error > 0 ? '+' : ''}{d.error}%
        </p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const { roundResults, expectedTPR, user, resetApp, language } = useApp();

  const tpr = expectedTPR ?? 1.0;
  const analysis = useMemo(() => analyzeResults(roundResults, tpr, language), [roundResults, tpr, language]);

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
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
      <div className="orb orb-purple" style={{ opacity: 0.2 }} />
      <div className="orb orb-cyan" style={{ opacity: 0.12 }} />
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none" />

      <div className="min-h-full w-full flex items-center justify-center p-4 py-12 relative z-10">
        <div className="w-full max-w-lg flex flex-col gap-6 mx-auto">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t(language, 'resultsForUser', { name: user?.name || '' })}
          </p>
          <h1 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {t(language, 'resultsTitle')}
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
              label: t(language, 'resultsAvgError'),
              value: `±${avgError.toFixed(1)}%`,
              sub: t(language, 'resultsAvgErrorSub'),
              color: analysis.color,
            },
            {
              label: t(language, 'resultsPerceptionRatio'),
              value: `${analysis.actualMeanRatio.toFixed(2)}x`,
              sub: t(language, 'resultsPerceptionRatioSub'),
              color: '#7c3aed',
            },
            {
              label: t(language, 'resultsProfileScore'),
              value: `${(tpr * 100).toFixed(0)}/100`,
              sub: t(language, 'resultsProfileScoreSub'),
              color: '#06b6d4',
            },
            {
              label: t(language, 'resultsRoundsComplete'),
              value: `${roundResults.length}/5`,
              sub: t(language, 'resultsRoundsCompleteSub'),
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
            {t(language, 'resultsChartTitle')}
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
              <Tooltip content={<CustomTooltip language={language} />} />
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
              { color: '#10b981', label: t(language, 'resultsGood') },
              { color: '#f59e0b', label: t(language, 'resultsMid') },
              { color: '#ef4444', label: t(language, 'resultsBad') },
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
            {t(language, 'resultsRoundDetails')}
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
                      {t(language, 'resultsRoundTarget')} <strong style={{ color: 'white' }}>{r.targetSeconds}s</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {t(language, 'resultsRoundActual')} <strong style={{ color: 'white' }}>{r.actualSeconds}s</strong>
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

        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{
            background: 'rgba(124,58,237,0.07)',
            border: '1px solid rgba(124,58,237,0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: '#a855f7' }}>{t(language, 'resultsScienceTitle')}</strong>
          <br />
          {t(language, 'resultsScienceP1')}
          <br />
          {t(language, 'resultsScienceP2')}
          <br />
          {t(language, 'resultsScienceP3')}
        </div>

        <div
          className="p-6 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          <h3 className="text-lg font-bold mb-2 gradient-text">{t(language, 'resultsCtaTitle')}</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            {t(language, 'resultsCtaSub')}
          </p>
          <button
            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 mb-3"
            onClick={() => alert(t(language, 'appComingSoon'))}
          >
            <Zap size={18} />
            {t(language, 'resultsCtaBtn')}
            <ExternalLink size={14} />
          </button>
          <button
            onClick={resetApp}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            {t(language, 'resultsRestartBtn')}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
