import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import {Controller} from 'react-hook-form';

import useRegister from '@/hooks/useRegister';
import ImageCropPicker from 'react-native-image-crop-picker';
import {AuthScreenProps} from '@/navigations/type';

type Props = AuthScreenProps<'RegisterScreen'>;

const registerFormData = [
  {
    value: 'name',
    placeholder: 'Enter your username',
  },
  {
    value: 'email',
    placeholder: 'Enter your email address',
  },
  {
    value: 'password',
    placeholder: 'Enter your password',
  },
  {
    value: 'confirm',
    placeholder: 'Enter your confirm password',
  },
];

type FieldName = 'email' | 'password' | 'confirm' | 'name' | 'avatar';

const SignupScreen: React.FC<Props> = ({navigation, route}) => {
  const {control, handleSubmit, onSubmit, setValue} = useRegister(navigation);
  const uploadImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.9,
        includeBase64: true,
      });
      console.log(image.path);
      if (image) {
        setValue('avatar', image.data);
        setAvatar('data:image/jpeg;base64,' + image.data);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      return null;
    }
  };
  const [avatar, setAvatar] = useState<string | null | undefined>('');

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-[1]  items-center justify-center">
        <View className="w-[70%]">
          <Text className="text-black text-center">Register Screen</Text>
          <TouchableOpacity
            className="flex items-center my-3"
            onPress={uploadImage}>
            <Image
              source={{
                uri: avatar
                  ? avatar
                  : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
              }}
              className="w-[80px] h-[80px] rounded-full"
            />
            {avatar != '' ? null : (
              <Text className="text-black pl-2">upload image</Text>
            )}
          </TouchableOpacity>
          {registerFormData.map(item => (
            <React.Fragment key={item.value}>
              <Controller
                control={control}
                name={item.value as FieldName}
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
                      placeholder={item.placeholder}
                    />
                    <Text style={{color: 'red', fontSize: 16}}>
                      {error?.message}
                    </Text>
                  </View>
                )}
              />
            </React.Fragment>
          ))}

          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <View className="align-middle">
              <Text className="bg-black w-full text-center p-4 text-white">
                Sign Up
              </Text>
            </View>
          </TouchableOpacity>

          <Text
            className="p-3 text-black"
            onPress={() => navigation.navigate('LoginScreen')}>
            If you have an account, please sign in
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;
