'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { questions, Question } from '@/lib/questionsData';
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
  | 'survey'
  | 'loading'
  | 'test'
  | 'results';

interface AppState {
  stage: AppStage;
  user: { name: string; email: string } | null;
  answers: Answer[];
  expectedTPR: number | null; // Time Perception Ratio (NEVER displayed)
  roundResults: RoundResult[];
  currentRound: number;
  language: Language;
}

interface AppContextValue extends AppState {
  setLanguage: (lang: Language) => void;
  setStage: (stage: AppStage) => void;
  setUser: (user: { name: string; email: string }) => void;
  submitAnswer: (answer: Answer) => void;
  computeTPR: () => void;
  addRoundResult: (result: RoundResult) => void;
  resetApp: () => void;
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

/**
 * Computes the Time Perception Ratio (TPR)
 * Based on scientific literature weights.
 * 
 * TPR = 1.0 means baseline (healthy) time perception.
 * TPR < 1.0 means time feels faster than it is (underestimation of durations).
 * TPR > 1.0 means time feels slower (overestimation of durations).
 */
export function computeTimePerceptionRatio(answers: Answer[]): number {
  let impact = 0;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    if (question.type === 'number' && question.impactFn) {
      impact += question.impactFn(answer.value);
    } else if (question.type === 'choice' && question.choices) {
      const selected = question.choices.find((c) => c.value === answer.value);
      if (selected) {
        impact += selected.coefficient;
      }
    }
  }

  // Clamp TPR between 0.4 and 1.3
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
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setLanguage = useCallback((lang: Language) => {
    setState((prev) => ({ ...prev, language: lang }));
  }, []);

  const setStage = useCallback((stage: AppStage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const setUser = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({ ...prev, user }));
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
    setState(initialState);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLanguage,
        setStage,
        setUser,
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
