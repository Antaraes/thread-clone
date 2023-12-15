import {AuthStackParamList, RootStackParamList} from '@/navigations/type';
import useAuthStore from '@/zustand/AuthStore';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useState} from 'react';

interface useLoginProps {}

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
  const {setAuth} = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const onChange = (field: string, value: string) => {
    if (field) {
      setFormData({...formData, [field]: value});
    }
  };
  const login = async (email: string, password: string) => {
    console.log('email: ' + email);
  };
  const onSubmit = async () => {
    const {email, password} = formData;
    setAuth();
    login(email, password);
    navigation.navigate('HomeScreen');
  };
  return {
    ...formData,
    onChange,
    onSubmit,
  };
};

export default useLogin;
