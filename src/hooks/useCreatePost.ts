import {
  AppStackParamList,
  AuthStackParamList,
  RootStackParamList,
} from '@/navigations/type';
import useAuthStore from '@/zustand/AuthStore';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import z from 'zod';
import {useState} from 'react';
import {LoginSchema} from '@/utils/validation/auth';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ToastAndroid} from 'react-native';

import {QueryClient, useMutation, useQueryClient} from 'react-query';
import {CreatePost, Login} from '@/api';
import {storage} from '@/zustand/MMKV';
import {PostSchema} from '@/utils/validation/post';

interface useLoginProps {}

type FormField = {
  posts: z.infer<typeof PostSchema>;
};
const useCreatePost = (
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppStackParamList, 'CreatePostScreen', undefined>,
    NativeStackNavigationProp<
      RootStackParamList,
      keyof RootStackParamList,
      undefined
    >
  >,
) => {
  const {setAuth, setUser, startLoading, stopLoading} = useAuthStore();
  const queryClient = useQueryClient();
  const {control, handleSubmit, reset} = useForm<FormField>({
    defaultValues: {
      posts: [
        {
          title: '',
          image: '',
          user: {
            email: '',
            password: '',
            name: '',
            avatar: '',
          },
        },
      ],
    },
    resolver: zodResolver(PostSchema),
  });

  const mutation = useMutation((data: FormField[]) => CreatePost(data.posts), {
    onSuccess: async response => {
      startLoading();
      await ToastAndroid.showWithGravity(
        'Create Post Success',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('AppScreen', {screen: 'HomeScreen'});
      reset();
      stopLoading();
    },
    onError: async error => {
      stopLoading();
      console.log(error);
      await ToastAndroid.showWithGravity(
        'Create Post Failed',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      // navigation.navigate('LoginScreen');
    },
    onSettled: () => {
      startLoading();
    },
  });

  const onSubmit: SubmitHandler<FormField> = value => {
    mutation.mutate(value);
  };

  return {
    control,
    handleSubmit,
    onSubmit,
  };
};

export default useCreatePost;
