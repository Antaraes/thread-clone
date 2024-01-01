import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {AuthScreenProps} from '@/navigations/type';
import useLogin from '@/hooks/useLogin';
import {Controller} from 'react-hook-form';
import useAuthStore from '@/zustand/AuthStore';

type Props = AuthScreenProps<'LoginScreen'>;

const LoginScreen: React.FC<Props> = ({navigation, route}) => {
  const {control, handleSubmit, onSubmit} = useLogin(navigation);
  const {isLoading} = useAuthStore();
  if (isLoading) {
    <View className="bg-[#F1F4F8] flex-1 dark:bg-[#070A0E] justify-center items-center">
      <ActivityIndicator animating={true} color={'#ffff'} />
    </View>;
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-[1]  items-center justify-center">
        <View className="w-[70%]">
          <Text className="text-black text-center">LoginScreen</Text>
          <Controller
            control={control}
            name="email"
            render={({
              field: {value, onChange, onBlur},
              fieldState: {error},
            }) => (
              <View>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#8888"
                  style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    color: 'black',
                    paddingHorizontal: 2,
                    marginVertical: 2,
                  }}
                  placeholder="Email"
                />
                <Text style={{color: 'red', fontSize: 16}}>
                  {error?.message}
                </Text>
              </View>
            )}
          />

          {/* Controller for Password */}
          <Controller
            control={control}
            name="password"
            render={({
              field: {value, onChange, onBlur},
              fieldState: {error},
            }) => (
              <View>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#8888"
                  style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    color: 'black',
                    paddingHorizontal: 2,
                    marginVertical: 2,
                  }}
                  placeholder="Password"
                  secureTextEntry={true}
                />
                <Text style={{color: 'red', fontSize: 16}}>
                  {error?.message}
                </Text>
              </View>
            )}
          />
          <TouchableHighlight onPress={handleSubmit(onSubmit)}>
            <View className=" align-middle ">
              <Text className="bg-black  w-full text-center  p-4 color-white">
                Login
              </Text>
            </View>
          </TouchableHighlight>
          <Text
            className="p-3  text-black"
            onPress={() => navigation.navigate('RegisterScreen')}>
            Don't Have Any Account? Please Sign Up
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
