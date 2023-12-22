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
import {Login} from '@/api';
import {storage} from '@/zustand/MMKV';

interface useLoginProps {}

const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: LoginSchema) => Login(data), {
    onSuccess: response => {
      const userData = response?.data;
      if (userData) {
        queryClient.setQueryData('user', userData);
      }
    },
  });
};
type FormField = z.infer<typeof LoginSchema>;
const useLogin = (
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, 'LoginScreen', undefined>,
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
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });

  const mutation = useMutation((data: LoginSchema) => Login(data), {
    onSuccess: async response => {
      startLoading();
      setUser(response.data);
      console.log(response.data.token);
      await storage.set('user', JSON.stringify(response.data));
      await ToastAndroid.showWithGravity(
        'Login Success',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      reset();
      setAuth();
      navigation.navigate('AppScreen', {screen: 'ProfileScreen'});
      stopLoading();
    },
    onError: async error => {
      stopLoading();
      console.log(error);
      await ToastAndroid.showWithGravity(
        'Login Failed',
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

export default useLogin;
