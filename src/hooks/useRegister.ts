import {AuthStackParamList, RootStackParamList} from '@/navigations/type';
import useAuthStore from '@/zustand/AuthStore';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import z from 'zod';
import {RegisterSchema} from '@/utils/validation/auth';
import {SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import * as api from '@/api/index';
import {useMutation} from 'react-query';
import {ToastAndroid} from 'react-native';

type FormField = z.infer<typeof RegisterSchema>;

const useRegister = (
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, 'RegisterScreen', undefined>,
    NativeStackNavigationProp<
      RootStackParamList,
      keyof RootStackParamList,
      undefined
    >
  >,
) => {
  const {setAuth, setUser, startLoading, stopLoading, isLoading} =
    useAuthStore();

  const {control, handleSubmit, reset, setValue} = useForm<FormField>({
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
      name: '',
      avatar: '',
    },
    resolver: zodResolver(RegisterSchema),
  });
  const mutation = useMutation((data: SignUpSchema) => api.SignUp(data), {
    onSuccess: async response => {
      startLoading();
      await ToastAndroid.showWithGravity(
        'Sign up Success',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      reset();
      navigation.navigate('LoginScreen');
      stopLoading();
    },
    onError: async error => {
      stopLoading();
      console.log(error);
      await ToastAndroid.showWithGravity(
        'Signup Failed',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      // navigation.navigate('LoginScreen');
    },
    onSettled: () => {
      startLoading();
    },
  });

  const onSubmit: SubmitHandler<FormField> = async value => {
    mutation.mutate(value);
  };

  return {
    control,
    setValue,
    handleSubmit,
    onSubmit,
  };
};

export default useRegister;
