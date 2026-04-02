'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import SurveyScreen from '@/components/SurveyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ChronometerScreen from '@/components/ChronometerScreen';
import ResultsScreen from '@/components/ResultsScreen';
import TestIntroScreen from '@/components/TestIntroScreen';

export default function TestPage() {
  const { stage, setStage } = useApp();

  // Ensure user starts at intro screen, not auth lock
  useEffect(() => {
    if (stage === 'auth') {
      setStage('intro');
    }
  }, [stage, setStage]);

  return (
    <div 
      className="min-h-[calc(100vh-80px)] w-full flex justify-center items-start pb-28 px-6 overflow-y-auto"
      style={{ paddingTop: '80px' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="orb orb-purple opacity-20 animate-float-slow" style={{ top: '-5%', left: '-5%', width: '40vw', height: '40vw' }} />
        <div className="orb orb-cyan opacity-20 animate-float-slower" style={{ bottom: '5%', right: '-5%', width: '35vw', height: '35vw' }} />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>

      <div className="w-full max-w-3xl flex flex-col justify-center items-center animate-fade-in-up py-4 relative z-10">
        {stage === 'intro' && <TestIntroScreen />}
        {stage === 'survey' && <SurveyScreen />}
        {stage === 'loading' && <LoadingScreen />}
        {stage === 'test' && <ChronometerScreen />}
        {stage === 'results' && <ResultsScreen />}
        {stage === 'auth' && (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-10 h-10 border-4 border-[var(--accent-purple)] border-t-white rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)] uppercase tracking-widest text-sm font-semibold">Test Yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
