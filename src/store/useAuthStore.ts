import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

const deriveRole = (user: User | null): AuthState['role'] => {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata || {};
  const role = metadata.role;

  if (role === 'ngo' || role === 'volunteer' || role === 'coordinator') {
    return role;
  }

  return 'volunteer';
};

interface AuthState {
  user: any | null;
  role: 'ngo' | 'volunteer' | 'coordinator' | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: any) => void;
  setRole: (role: AuthState['role']) => void;
  syncSession: (session: Session | null) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  initializeAuth: () => (() => void);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  syncSession: (session) => {
    const user = session?.user ?? null;
    set({
      user,
      role: deriveRole(user),
      isLoading: false,
      initialized: true,
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null, isLoading: false, initialized: true });
  },
  checkSession: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({
      user: session?.user ?? null,
      role: deriveRole(session?.user ?? null),
      isLoading: false,
      initialized: true,
    });
  },
  initializeAuth: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().syncSession(session);
    });

    void useAuthStore.getState().checkSession();

    return () => subscription.unsubscribe();
  },
}));
