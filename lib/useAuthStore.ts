import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as bcrypt from 'bcryptjs';

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
  passwordHash: string;
  createdAt: string;
  avatarUrl?: string;
  testResults?: TestResult[];
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  register: (fullName: string, username: string, email: string, rawPass: string) => { success: boolean, error?: string };
  login: (identifier: string, rawPass: string) => { success: boolean, error?: string, user?: User };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean, error?: string };
  updateUser: (userId: string, changes: Partial<User>) => void;
  addTestResult: (userId: string, result: Omit<TestResult, 'id'>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      
      register: (fullName, username, email, rawPass) => {
        const { users } = get();
        
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
          return { success: false, error: 'username_taken' };
        }
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'email_taken' };
        }
        
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(rawPass, salt);
        
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          fullName,
          username,
          email,
          passwordHash,
          createdAt: new Date().toISOString()
        };
        
        set({ users: [...users, newUser], currentUser: newUser });
        return { success: true };
      },
      
      login: (identifier, rawPass) => {
        const { users } = get();
        
        const user = users.find(
          u => u.username.toLowerCase() === identifier.toLowerCase() || 
               u.email.toLowerCase() === identifier.toLowerCase()
        );
        
        if (!user) {
          return { success: false, error: 'user_not_found' };
        }
        
        const isMatch = bcrypt.compareSync(rawPass, user.passwordHash);
        if (!isMatch) {
          return { success: false, error: 'wrong_password' };
        }
        
        set({ currentUser: user });
        return { success: true, user };
      },
      
      logout: () => {
        set({ currentUser: null });
      },
      
      resetPassword: (email) => {
        const { users } = get();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return { success: false, error: 'user_not_found' };
        }
        return { success: true };
      },

      updateUser: (userId, changes) => {
        set((state) => {
          const newUsers = state.users.map(u => u.id === userId ? { ...u, ...changes } : u);
          const newCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, ...changes } : state.currentUser;
          return { users: newUsers, currentUser: newCurrentUser };
        });
      },
      
      addTestResult: (userId, result) => {
        set((state) => {
          const newResult = { ...result, id: Math.random().toString(36).substring(2, 9) };
          const newUsers = state.users.map(u => {
            if (u.id === userId) {
              const testResults = u.testResults ? [newResult, ...u.testResults] : [newResult];
              return { ...u, testResults };
            }
            return u;
          });
          const newCurrentUser = state.currentUser?.id === userId ? {
            ...state.currentUser,
            testResults: state.currentUser.testResults ? [newResult, ...state.currentUser.testResults] : [newResult]
          } : state.currentUser;
          
          return { users: newUsers, currentUser: newCurrentUser };
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
