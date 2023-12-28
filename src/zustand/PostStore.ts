import {create} from 'zustand';

interface PostState {
  isLoading: boolean;
  posts: object | Post;
  setPost: (postData: object) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const useAuthStore = create<PostState>(set => ({
  isLoading: true,
  posts: {},
  setPost: postData => set(state => ({...state, posts: postData})),
  startLoading: () => set({isLoading: true}),
  stopLoading: () => set({isLoading: false}),
}));

export default useAuthStore;
