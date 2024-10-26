import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  user: any | null;
  cards: any[];
  loading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: any | null) => void;
  setCards: (cards: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      user: null,
      cards: [],
      loading: false,
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
      setCards: (cards) => set({ cards }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'app-storage',
    }
  )
);
