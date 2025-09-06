import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { account } from '$lib/appwrite';

export interface User {
  $id: string;
  name: string;
  email: string;
  avatar?: string;
  prefs?: {
    theme?: string;
    timezone?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    // Initialize auth state
    init: async () => {
      if (!browser) return;
      
      try {
        update(state => ({ ...state, isLoading: true }));
        const session = await account.get();
        
        const user: User = {
          $id: session.$id,
          name: session.name,
          email: session.email,
          avatar: session.prefs?.avatar,
          prefs: session.prefs
        };
        
        set({
          user,
          isLoading: false,
          isAuthenticated: true
        });
      } catch (error) {
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    },

    // Login with Google
    loginWithGoogle: async () => {
      try {
        await account.createOAuth2Session(
          'google' as any,
          `${window.location.origin}/dashboard`,
          `${window.location.origin}/auth/failure`
        );
      } catch (error) {
        console.error('Google login failed:', error);
        throw error;
      }
    },

    // Login with email and password
    login: async (email: string, password: string) => {
      try {
        update(state => ({ ...state, isLoading: true }));
        await account.createSession(email, password);
        const session = await account.get();
        
        const user: User = {
          $id: session.$id,
          name: session.name,
          email: session.email,
          avatar: session.prefs?.avatar,
          prefs: session.prefs
        };
        
        set({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        
        return user;
      } catch (error) {
        update(state => ({ ...state, isLoading: false }));
        throw error;
      }
    },

    // Register new user
    register: async (email: string, password: string, name: string) => {
      try {
        update(state => ({ ...state, isLoading: true }));
        await account.create('unique()', email, password, name);
        return await account.createSession(email, password);
      } catch (error) {
        update(state => ({ ...state, isLoading: false }));
        throw error;
      }
    },

    // Logout
    logout: async () => {
      try {
        await account.deleteSession('current');
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      } catch (error) {
        // Even if logout fails, clear local state
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    },

    // Update user data
    updateUser: (userData: Partial<User>) => {
      update(state => ({
        ...state,
        user: state.user ? { ...state.user, ...userData } : null
      }));
    }
  };
}

export const authStore = createAuthStore();