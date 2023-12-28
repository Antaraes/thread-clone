import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User;
  setAuth: () => void;
  setUser: (userData: User) => void;
  startLoading: () => void;
  stopLoading: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: '',
    avatar: '',
    name: '',
    password: '',
    followers: [],
    following: [],
    userName: '',
  },
  setAuth: () => set(state => ({...state, isAuthenticated: true})),
  setUser: userData => set(state => ({...state, user: userData})),
  startLoading: () => set({isLoading: true}),
  stopLoading: () => set({isLoading: false}),
  logout: () => set(state => ({...state, isAuthenticated: false})),
}));

export default useAuthStore;
