'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { questions } from '@/lib/questionsData';
import { Language } from '@/lib/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Answer {
  questionId: string;
  value: number;
}

export interface RoundResult {
  round: number;
  targetSeconds: number;
  actualSeconds: number;
  errorRatio: number; // actual/target (1.0 = perfect)
  errorPercent: number; // deviation percentage
}

export type AppStage =
  | 'auth'
  | 'intro'
  | 'survey'
  | 'loading'
  | 'test'
  | 'results';

export type ThemeMode = 'dark' | 'light' | 'auto';

interface AppState {
  stage: AppStage;
  user: { name: string; email: string } | null;
  answers: Answer[];
  expectedTPR: number | null;
  roundResults: RoundResult[];
  currentRound: number;
  language: Language;
  theme: ThemeMode;
}

interface AppContextValue extends AppState {
  setLanguage: (lang: Language) => void;
  setStage: (stage: AppStage) => void;
  setUser: (user: { name: string; email: string }) => void;
  submitAnswer: (answer: Answer) => void;
  computeTPR: () => void;
  addRoundResult: (result: RoundResult) => void;
  resetApp: () => void;
  setTheme: (theme: ThemeMode) => void;
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

export function computeTimePerceptionRatio(answers: Answer[]): number {
  let impact = 0;
  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    if (question.type === 'number' && question.impactFn) {
      impact += question.impactFn(answer.value);
    } else if (question.type === 'choice' && question.choices) {
      const selected = question.choices.find((c) => c.value === answer.value);
      if (selected) impact += selected.coefficient;
    }
  }
  const tpr = Math.max(0.4, Math.min(1.3, 1.0 + impact));
  return Math.round(tpr * 1000) / 1000;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const initialState: AppState = {
  stage: 'auth',
  user: null,
  answers: [],
  expectedTPR: null,
  roundResults: [],
  currentRound: 0,
  language: 'tr',
  theme: 'auto',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    // Persist theme preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tp-theme') as ThemeMode | null;
      if (saved) return { ...initialState, theme: saved };
    }
    return initialState;
  });

  // Apply data-theme attribute to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', state.theme);
    }
    localStorage.setItem('tp-theme', state.theme);
  }, [state.theme]);

  const setLanguage = useCallback((lang: Language) => {
    setState((prev) => ({ ...prev, language: lang }));
  }, []);

  const setStage = useCallback((stage: AppStage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const setUser = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const submitAnswer = useCallback((answer: Answer) => {
    setState((prev) => {
      const existing = prev.answers.findIndex((a) => a.questionId === answer.questionId);
      if (existing >= 0) {
        const updated = [...prev.answers];
        updated[existing] = answer;
        return { ...prev, answers: updated };
      }
      return { ...prev, answers: [...prev.answers, answer] };
    });
  }, []);

  const computeTPR = useCallback(() => {
    setState((prev) => {
      const tpr = computeTimePerceptionRatio(prev.answers);
      return { ...prev, expectedTPR: tpr };
    });
  }, []);

  const addRoundResult = useCallback((result: RoundResult) => {
    setState((prev) => ({
      ...prev,
      roundResults: [...prev.roundResults, result],
      currentRound: prev.currentRound + 1,
    }));
  }, []);

  const resetApp = useCallback(() => {
    setState((prev) => ({ ...initialState, language: prev.language, theme: prev.theme }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLanguage,
        setStage,
        setUser,
        setTheme,
        submitAnswer,
        computeTPR,
        addRoundResult,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
