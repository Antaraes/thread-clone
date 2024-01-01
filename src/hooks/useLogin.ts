import {CompositeNavigationProp} from '@react-navigation/native';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation, useQueryClient} from 'react-query';
import {ToastAndroid} from 'react-native';

import {LoginSchema} from '@/utils/validation/auth';
import {Login} from '@/api';
import {storage} from '@/zustand/MMKV';
import useAuthStore from '@/zustand/AuthStore';
import {AuthStackParamList, RootStackParamList} from '@/navigations/type';
import {z} from 'zod';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LoginSchema as LoginType} from '@/type';

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

  const mutation = useMutation((data: LoginType) => Login(data), {
    onSuccess: async response => {
      startLoading();
      const userData = response?.data;

      if (userData && userData.accessToken) {
        // Save user data and token to storage

        await storage.set('user', JSON.stringify(userData.user));
        await storage.set('token', userData.accessToken);
        queryClient.setQueryData('user', userData);

        setUser(userData);

        await ToastAndroid.showWithGravity(
          'Login Success',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );

        reset();
        setAuth();
        navigation.navigate('AppScreen', {screen: 'HomeScreen'});
      } else {
        await ToastAndroid.showWithGravity(
          'Invalid response data',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }

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
