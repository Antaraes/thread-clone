import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  isLoading: true,
  setAuth: () => set(state => ({...state, isAuthenticated: true})),
  logout: () => set(state => ({...state, isAuthenticated: false})),
}));

export default useAuthStore;
