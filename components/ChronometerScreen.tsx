'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useApp, RoundResult } from '@/lib/AppContext';
import { Play, Square, Timer, CheckCircle2, Trophy } from 'lucide-react';

const ROUNDS = [
  { target: 5,  label: '5 saniye' },
  { target: 8,  label: '8 saniye' },
  { target: 12, label: '12 saniye' },
  { target: 15, label: '15 saniye' },
  { target: 20, label: '20 saniye' },
];

type Phase = 'idle' | 'running' | 'done';

export default function ChronometerScreen() {
  const { addRoundResult, setStage, roundResults, currentRound, user } = useApp();

  const [phase, setPhase] = useState<Phase>('idle');
  const [completedRounds, setCompletedRounds] = useState<RoundResult[]>([]);
  const [showBrief, setShowBrief] = useState(false);
  const [lastError, setLastError] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const roundIndex = completedRounds.length;
  const currentRoundData = ROUNDS[roundIndex];
  const isFinished = roundIndex >= ROUNDS.length;

  // Pulse animation for running state
  const [pulseSize, setPulseSize] = useState(1);
  useEffect(() => {
    if (phase !== 'running') return;
    let growing = true;
    const interval = setInterval(() => {
      setPulseSize((prev) => {
        if (prev >= 1.3) growing = false;
        if (prev <= 1.0) growing = true;
        return growing ? prev + 0.015 : prev - 0.015;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  const handleStart = useCallback(() => {
    setPhase('running');
    startTimeRef.current = performance.now();
    setShowBrief(false);
    setLastError(null);
  }, []);

  const handleStop = useCallback(() => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const target = currentRoundData.target;
    const errorRatio = elapsed / target;
    const errorPercent = ((elapsed - target) / target) * 100;

    const result: RoundResult = {
      round: roundIndex + 1,
      targetSeconds: target,
      actualSeconds: Math.round(elapsed * 100) / 100,
      errorRatio,
      errorPercent: Math.round(errorPercent * 10) / 10,
    };

    setLastError(errorPercent);
    addRoundResult(result);
    setCompletedRounds((prev) => [...prev, result]);
    setPhase('done');
    setShowBrief(true);
  }, [currentRoundData, roundIndex, addRoundResult]);

  const handleNextRound = useCallback(() => {
    setPhase('idle');
    setShowBrief(false);
  }, []);

  const handleGoToResults = useCallback(() => {
    setStage('results');
  }, [setStage]);

  // Color for error display
  const getErrorColor = (pct: number) => {
    const abs = Math.abs(pct);
    if (abs <= 10) return '#10b981'; // green - good
    if (abs <= 25) return '#f59e0b'; // yellow - ok
    return '#ef4444'; // red - poor
  };

  const getErrorLabel = (pct: number) => {
    if (pct > 0) return `+${pct.toFixed(1)}% geç bastın`;
    return `${pct.toFixed(1)}% erken bastın`;
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="orb orb-purple" style={{ opacity: 0.15 }} />
      <div className="orb orb-cyan" style={{ opacity: 0.1 }} />
      <div className="bg-grid fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Hoş geldin, {user?.name}
          </p>
          <h1 className="text-2xl font-bold gradient-text">Kör Kronometre Testi</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            İçinden say ve hissettiğinde durdur
          </p>
        </div>

        {/* Round indicators */}
        <div className="flex gap-2 justify-center mb-8">
          {ROUNDS.map((r, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background:
                    i < completedRounds.length
                      ? 'linear-gradient(135deg, #7c3aed, #5b21b6)'
                      : i === completedRounds.length
                      ? 'rgba(124,58,237,0.2)'
                      : 'rgba(30,30,53,0.8)',
                  border:
                    i === completedRounds.length
                      ? '2px solid #7c3aed'
                      : i < completedRounds.length
                      ? '2px solid #5b21b6'
                      : '2px solid var(--border-accent)',
                  color:
                    i < completedRounds.length
                      ? 'white'
                      : i === completedRounds.length
                      ? '#a855f7'
                      : 'var(--text-muted)',
                  boxShadow: i === completedRounds.length ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                {i < completedRounds.length ? '✓' : i + 1}
              </div>
              <span className="text-xs" style={{ color: i < completedRounds.length ? '#7c3aed' : 'var(--text-muted)' }}>
                {r.target}s
              </span>
            </div>
          ))}
        </div>

        {/* Main card */}
        {!isFinished ? (
          <div className="glass-card p-8 text-center">
            {/* Round label */}
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-purple-light)' }}>
              TUR {roundIndex + 1} / {ROUNDS.length}
            </p>

            {/* Target duration — only if not running */}
            <div className="mb-8">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Hedef Süre
              </p>
              <p className="text-5xl font-black mt-1 gradient-text">
                {currentRoundData?.label}
              </p>
            </div>

            {/* Animated circle */}
            <div
              className="mx-auto mb-8 rounded-full flex items-center justify-center transition-all duration-150"
              style={{
                width: 140,
                height: 140,
                transform: phase === 'running' ? `scale(${pulseSize})` : 'scale(1)',
                background:
                  phase === 'running'
                    ? 'radial-gradient(circle, rgba(124,58,237,0.4), rgba(124,58,237,0.1))'
                    : 'rgba(18,18,31,0.8)',
                border: phase === 'running' ? '2px solid #7c3aed' : '2px solid var(--border-accent)',
                boxShadow: phase === 'running' ? '0 0 40px rgba(124,58,237,0.5)' : 'none',
              }}
            >
              {phase === 'idle' && (
                <Timer size={40} style={{ color: 'var(--text-muted)' }} />
              )}
              {phase === 'running' && (
                <div className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2 animate-pulse"
                    style={{ background: '#7c3aed', boxShadow: '0 0 15px #7c3aed' }}
                  />
                  <p className="text-xs font-semibold" style={{ color: '#a855f7' }}>sayıyor...</p>
                </div>
              )}
              {phase === 'done' && showBrief && (
                <CheckCircle2 size={40} style={{ color: '#10b981' }} />
              )}
            </div>

            {/* Brief result flash */}
            {showBrief && lastError !== null && (
              <div
                className="mb-6 py-3 px-4 rounded-xl"
                style={{ background: `${getErrorColor(lastError)}15`, border: `1px solid ${getErrorColor(lastError)}40` }}
              >
                <p className="text-sm font-bold" style={{ color: getErrorColor(lastError) }}>
                  {getErrorLabel(lastError)}
                </p>
              </div>
            )}

            {/* Instructions */}
            {phase === 'idle' && !showBrief && (
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Hazır olduğunda <strong style={{ color: 'var(--text-secondary)' }}>Başlat</strong>'a bas, <br />
                {currentRoundData?.label} geçtiğini hissedince <strong style={{ color: 'var(--text-secondary)' }}>Durdur</strong>'a bas.
              </p>
            )}

            {/* Buttons */}
            {(phase === 'idle') && !showBrief && (
              <button onClick={handleStart} className="btn-primary w-full flex items-center justify-center gap-2">
                <Play size={18} />
                Başlat
              </button>
            )}
            {phase === 'running' && (
              <button onClick={handleStop} className="btn-danger w-full flex items-center justify-center gap-2">
                <Square size={18} />
                Durdur
              </button>
            )}
            {phase === 'done' && showBrief && roundIndex < ROUNDS.length && (
              <button onClick={handleNextRound} className="btn-primary w-full flex items-center justify-center gap-2">
                {roundIndex + 1 >= ROUNDS.length ? (
                  <>
                    <Trophy size={18} />
                    Sonuçları Gör
                  </>
                ) : (
                  <>
                    Sonraki Tur
                    <span className="text-sm opacity-70">({ROUNDS[roundIndex]?.target}s)</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          /* All rounds done */
          <div className="glass-card p-8 text-center">
            <Trophy size={48} className="mx-auto mb-4" style={{ color: '#f59e0b' }} />
            <h2 className="text-2xl font-bold mb-2 gradient-text">Test Tamamlandı!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              5 tur başarıyla tamamlandı. Şimdi sonuçlarını analiz ediyoruz...
            </p>
            <button onClick={handleGoToResults} className="btn-primary w-full">
              Sonuçlarımı Gör
            </button>
          </div>
        )}

        {/* Warning note */}
        <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Ekranı kapatma — kronometrenin göründüğü tek yer bu tur kartı
        </p>
      </div>
    </div>
  );
}
