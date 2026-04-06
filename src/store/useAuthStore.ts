import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: any | null;
  role: 'ngo' | 'volunteer' | 'coordinator' | null;
  isLoading: boolean;
  setUser: (user: any) => void;
  setRole: (role: AuthState['role']) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  },
  checkSession: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const metadata = session.user.user_metadata || {};
      set({ user: session.user, role: metadata.role || 'volunteer', isLoading: false });
    } else {
      set({ user: null, role: null, isLoading: false });
    }
  }
}));
