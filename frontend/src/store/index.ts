import create from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  // add other user properties as needed
}

interface Card {
  id: string;
  // add other card properties as needed
}

interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  cards: Card[];
  loading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: User | null) => void;
  setCards: (cards: Card[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  theme: 'light',
  user: null,
  cards: [],
  loading: false,
  setTheme: (theme) => set({ theme }),
  setUser: (user) => set({ user }),
  setCards: (cards) => set({ cards }),
  setLoading: (loading) => set({ loading }),
}));
