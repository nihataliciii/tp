'use client';

import { AppProvider, useApp } from '@/lib/AppContext';
import AuthScreen from '@/components/AuthScreen';
import SurveyScreen from '@/components/SurveyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ChronometerScreen from '@/components/ChronometerScreen';
import ResultsScreen from '@/components/ResultsScreen';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/Logo';

function AppRouter() {
  const { stage } = useApp();

  switch (stage) {
    case 'auth':
      return <AuthScreen />;
    case 'survey':
      return <SurveyScreen />;
    case 'loading':
      return <LoadingScreen />;
    case 'test':
      return <ChronometerScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <AuthScreen />;
  }
}

export default function Home() {
  return (
    <AppProvider>
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 pointer-events-none">
        <div className="flex-1" />
        <div className="flex-shrink-0 pointer-events-auto">
          <Logo />
        </div>
        <div className="flex-1 flex justify-end pointer-events-auto">
          <LanguageSelector />
        </div>
      </header>
      <AppRouter />
    </AppProvider>
  );
}
