'use client';

import { AppProvider, useApp } from '@/lib/AppContext';
import AuthScreen from '@/components/AuthScreen';
import SurveyScreen from '@/components/SurveyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ChronometerScreen from '@/components/ChronometerScreen';
import ResultsScreen from '@/components/ResultsScreen';
import LanguageSelector from '@/components/LanguageSelector';

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
      <LanguageSelector />
      <AppRouter />
    </AppProvider>
  );
}
