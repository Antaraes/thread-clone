import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import React from 'react';
import {AuthScreenProps} from '@/navigations/type';
import useLogin from '@/hooks/useLogin';

type Props = AuthScreenProps<'LoginScreen'>;

const LoginScreen: React.FC<Props> = ({navigation, route}) => {
  const {email, password, onChange, onSubmit} = useLogin(navigation);
  return (
    <View className="flex-[1]  items-center justify-center">
      <View className="w-[70%]">
        <Text className="text-black text-center">LoginScreen</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={'#8888'}
          onChangeText={text => onChange('email', text)}
          className="w-full  border text-black px-2 my-2"
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={'#8888'}
          onChangeText={text => onChange('password', text)}
          className="w-full  border text-black px-2 my-2"
          secureTextEntry={true}
        />
        <TouchableHighlight onPress={() => onSubmit()}>
          <View className=" align-middle ">
            <Text className="bg-black  w-full text-center  p-4">Login</Text>
          </View>
        </TouchableHighlight>
        <Text className="p-3  text-black">
          Don't Have Any Account? Please Sign Up
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
