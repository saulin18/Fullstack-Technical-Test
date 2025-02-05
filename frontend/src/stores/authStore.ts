import { create } from "zustand";
import { User } from "../types/types";
import { registerUser, logoutApi, getCurrentUser } from "../api/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (userData: User) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const userData = await getCurrentUser();
     
      set({ 
        user: userData ? { 
          id: userData.id,
          username: userData.username,
          role: userData.role
        } : null,
        isLoading: false 
      });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  login: async (userData) => {
    set({ isLoading: true, error: null });
    try {
    
      set({ user: { ...userData }, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await registerUser(username, password);
      set({ 
        user: data.user ? { ...data.user } : null,
        isLoading: false 
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setUser: (user: User | null) => {
    
    set({ user: user ? { ...user } : null });
  },
}));

export default useAuthStore;