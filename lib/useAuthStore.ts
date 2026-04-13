import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import type { SupabaseClient, User as SBUser } from '@supabase/supabase-js';

export interface TestResult {
  id: string;
  date: string;
  testType: string;
  scoreStr: string;
  status: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  testResults?: TestResult[];
}

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  initialize: () => Promise<void>;
  register: (fullName: string, username: string, email: string, rawPass: string) => Promise<{ success: boolean; error?: string }>;
  login: (identifier: string, rawPass: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userId: string, changes: Partial<Pick<User, 'avatarUrl' | 'fullName' | 'username'>>) => Promise<void>;
  addTestResult: (userId: string, result: Omit<TestResult, 'id'>) => Promise<void>;
  fetchTestResults: (userId: string) => Promise<void>;
}

async function fetchProfile(supabase: SupabaseClient, sbUser: SBUser): Promise<User> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url, created_at')
    .eq('id', sbUser.id)
    .single();

  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    fullName: profile?.full_name ?? '',
    username: profile?.username ?? '',
    createdAt: profile?.created_at ?? sbUser.created_at,
    avatarUrl: profile?.avatar_url ?? undefined,
    testResults: undefined,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  loading: true,

  initialize: async () => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await fetchProfile(supabase, session.user);
        set({ currentUser: user, loading: false });
      } else {
        set({ currentUser: null, loading: false });
      }
    });
  },

  register: async (fullName, username, email, rawPass) => {
    const supabase = createClient();

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existing) return { success: false, error: 'username_taken' };

    const { data, error } = await supabase.auth.signUp({
      email,
      password: rawPass,
      options: { data: { full_name: fullName, username } },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        return { success: false, error: 'email_taken' };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) return { success: false, error: 'email_taken' };

    // Trigger profili oluşturur — burada manuel insert yok
    const user: User = {
      id: data.user.id,
      fullName,
      username,
      email,
      createdAt: data.user.created_at,
      testResults: [],
    };

    set({ currentUser: user });
    return { success: true };
  },

  login: async (identifier, rawPass) => {
    const supabase = createClient();

    let email = identifier;

    if (!identifier.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .maybeSingle();

      if (!profile) return { success: false, error: 'user_not_found' };
      email = profile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: rawPass });

    if (error || !data.user) {
      if (error?.message?.toLowerCase().includes('invalid')) {
        return { success: false, error: 'wrong_password' };
      }
      return { success: false, error: 'user_not_found' };
    }

    const user = await fetchProfile(supabase, data.user);
    set({ currentUser: user });
    return { success: true, user };
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ currentUser: null });
  },

  resetPassword: async (email) => {
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email);
    return { success: true };
  },

  updateUser: async (userId, changes) => {
    const supabase = createClient();
    const update: Record<string, string> = {};
    if (changes.fullName) update.full_name = changes.fullName;
    if (changes.username) update.username = changes.username;
    if (changes.avatarUrl !== undefined) update.avatar_url = changes.avatarUrl ?? '';

    await supabase.from('profiles').update(update).eq('id', userId);
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...changes } : null,
    }));
  },

  fetchTestResults: async (userId) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const testResults: TestResult[] = (data ?? []).map((r: Record<string, string>) => ({
      id: r.id,
      date: r.date,
      testType: r.test_type,
      scoreStr: r.score_str,
      status: r.status,
    }));

    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, testResults } : null,
    }));
  },

  addTestResult: async (userId, result) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('test_results')
      .insert({
        user_id: userId,
        date: result.date,
        test_type: result.testType,
        score_str: result.scoreStr,
        status: result.status,
      })
      .select()
      .single();

    if (data) {
      const newResult: TestResult = {
        id: data.id,
        date: data.date,
        testType: data.test_type,
        scoreStr: data.score_str,
        status: data.status,
      };
      set((state) => ({
        currentUser: state.currentUser
          ? { ...state.currentUser, testResults: [newResult, ...(state.currentUser.testResults ?? [])] }
          : null,
      }));
    }
  },
}));
