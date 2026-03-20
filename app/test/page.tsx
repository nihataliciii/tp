'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import SurveyScreen from '@/components/SurveyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ChronometerScreen from '@/components/ChronometerScreen';
import ResultsScreen from '@/components/ResultsScreen';

export default function TestPage() {
  const { stage, setStage } = useApp();

  // Ensure user starts at survey, avoiding the 'auth' state lock on this route
  useEffect(() => {
    if (stage === 'auth') {
      setStage('survey');
    }
  }, [stage, setStage]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-7xl flex flex-col justify-center items-center animate-fade-in-up">
        {stage === 'survey' && <SurveyScreen />}
        {stage === 'loading' && <LoadingScreen />}
        {stage === 'test' && <ChronometerScreen />}
        {stage === 'results' && <ResultsScreen />}
        {stage === 'auth' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-10 h-10 border-4 border-[var(--accent-purple)] border-t-white rounded-full animate-spin glow-border mb-4" />
            <p className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-semibold">Test Yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
