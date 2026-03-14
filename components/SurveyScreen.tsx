'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp, Answer } from '@/lib/AppContext';
import { questions, Question, Choice } from '@/lib/questionsData';
import { ChevronRight, ChevronLeft, BookOpen, FlaskConical } from 'lucide-react';

export default function SurveyScreen() {
  const { submitAnswer, answers, computeTPR, setStage } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localValue, setLocalValue] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const inputRef = useRef<HTMLInputElement>(null);

  const total = questions.length;
  const q = questions[currentIndex];
  const progress = ((currentIndex) / total) * 100;

  // Pre-fill from existing answers
  useEffect(() => {
    const existing = answers.find((a) => a.questionId === q.id);
    if (existing) {
      if (q.type === 'number') setLocalValue(String(existing.value));
      else if (q.type === 'choice') setSelectedChoice(existing.value);
    } else {
      setLocalValue('');
      setSelectedChoice(null);
    }
    if (q.type === 'number' && inputRef.current) inputRef.current.focus();
  }, [currentIndex, q.id]);

  const getCurrentAnswer = (): Answer | null => {
    if (q.type === 'number') {
      const num = parseFloat(localValue);
      if (isNaN(num)) return null;
      return { questionId: q.id, value: num };
    }
    if (q.type === 'choice' && selectedChoice !== null) {
      return { questionId: q.id, value: selectedChoice };
    }
    return null;
  };

  const canProceed = () => {
    if (q.type === 'number') return localValue !== '' && !isNaN(parseFloat(localValue));
    if (q.type === 'choice') return selectedChoice !== null;
    return false;
  };

  const handleNext = () => {
    const ans = getCurrentAnswer();
    if (!ans) return;
    submitAnswer(ans);
    if (currentIndex < total - 1) {
      setDirection('forward');
      setCurrentIndex(currentIndex + 1);
    } else {
      computeTPR();
      setStage('loading');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection('back');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const categoryColors: Record<string, string> = {
    sleep: '#6366f1',
    screenTime: '#06b6d4',
    shortVideo: '#ec4899',
    cognitive: '#f59e0b',
    lifestyle: '#10b981',
  };

  const categoryLabels: Record<string, string> = {
    sleep: 'Uyku',
    screenTime: 'Ekran Süresi',
    shortVideo: 'Kısa Video',
    cognitive: 'Bilişsel',
    lifestyle: 'Yaşam Tarzı',
  };

  const color = categoryColors[q.category] || '#7c3aed';

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 relative">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      <div className="bg-grid fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-6 flex-1">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Soru {currentIndex + 1} / {total}
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
            >
              {categoryLabels[q.category]}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border-accent)' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex) / total) * 100}%`, background: `linear-gradient(90deg, ${color}, #7c3aed)` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-6 flex-1">
          <h2 className="text-xl font-bold mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
            {q.question}
          </h2>
          {q.subtext && (
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{q.subtext}</p>
          )}

          {/* Input */}
          <div className="mt-4">
            {q.type === 'number' && (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="number"
                    step={q.step ?? 1}
                    min={q.min}
                    max={q.max}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                    className="input-field text-2xl font-bold text-center pr-16"
                    placeholder="0"
                    style={{ fontSize: '28px', height: '72px', borderColor: localValue ? color : '' }}
                  />
                  {q.unit && (
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {q.unit}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Min: {q.min} {q.unit}</span>
                  <span>Max: {q.max} {q.unit}</span>
                </div>
              </div>
            )}

            {q.type === 'choice' && q.choices && (
              <div className="flex flex-col gap-2.5 mt-2">
                {q.choices.map((choice) => (
                  <button
                    key={choice.value}
                    onClick={() => setSelectedChoice(choice.value)}
                    className="w-full text-left p-4 rounded-xl transition-all duration-200 border"
                    style={{
                      background: selectedChoice === choice.value
                        ? `${color}15`
                        : 'rgba(13,13,20,0.6)',
                      borderColor: selectedChoice === choice.value ? color : 'var(--border-accent)',
                      color: selectedChoice === choice.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: selectedChoice === choice.value ? `0 0 15px ${color}30` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all"
                        style={{
                          borderColor: selectedChoice === choice.value ? color : 'var(--text-muted)',
                          background: selectedChoice === choice.value ? color : 'transparent',
                          boxShadow: selectedChoice === choice.value ? `0 0 8px ${color}` : 'none',
                        }}
                      />
                      <span className="text-sm font-medium">{choice.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Academic Fact */}
          <div
            className="mt-6 p-4 rounded-xl flex gap-3"
            style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <FlaskConical size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#a855f7' }} />
            <div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {q.academicFact}
              </p>
              <p className="text-xs mt-1.5 font-semibold" style={{ color: '#6366f1' }}>
                — {q.factSource}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="btn-outline flex items-center gap-1.5 px-5"
            >
              <ChevronLeft size={16} />
              Geri
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex items-center justify-center gap-1.5 flex-1"
            style={{ opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? 'pointer' : 'not-allowed' }}
          >
            {currentIndex === total - 1 ? 'Analizi Başlat' : 'Devam Et'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
