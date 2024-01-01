import React, {useEffect, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import useAuthStore from '@/zustand/AuthStore';
import {AppScreenProps} from '@/navigations/type';
import {useColorScheme} from 'nativewind';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useMutation} from 'react-query';
import {CreatePost} from '@/api';
import {Post, User} from '@/type';
import {useFocusEffect} from '@react-navigation/native';

type Props = AppScreenProps<'CreatePostScreen'>;

const PostScreen: React.FC<Props> = ({navigation}) => {
  const {setAuth, startLoading, stopLoading, user} = useAuthStore();
  const {colorScheme} = useColorScheme();
  const HiddenInput = useRef();
  const {control, handleSubmit, reset, setValue} = useForm<Post>({
    defaultValues: {
      title: '',
      image: '',
      user: user as User,
    },
  });
  const {fields, append, remove, update} = useFieldArray({
    control,
    name: 'posts',
  });

  const uploadImage = async (index: number) => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 200,
        height: 200,
        cropping: true,
        compressImageQuality: 0.9,
        includeBase64: true,
      });
      if (image) {
        update(index, {
          ...fields[index],
          image: image?.data,
          previewImage: `data:image/jpeg;base64,${image.data}`,
        });
      }
      console.log(
        'index, image.path, fields[index]',
        index,
        image.path,
        fields[index],
      );
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  const removeThread = (index: number) => {
    remove(index);
  };

  const addNewThread = () => {
    if (
      fields[fields.length - 1].title !== '' ||
      fields[fields.length - 1].image !== ''
    ) {
      append({
        title: '',
        image: '',
        previewImage: '',
        user: user as User,
      });
    }
  };

  const initailableNewTread = () => {
    append({
      title: '',
      image: '',
      previewImage: '',
      user: user as User,
    });
  };
  useEffect(() => {
    initailableNewTread();
  }, []);
  const mutation = useMutation((data: Post[]) => CreatePost(data), {
    onSuccess: async response => {
      startLoading();
      await ToastAndroid.showWithGravity(
        'Create Post Success',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setAuth();
      reset();
      navigation.navigate('AppScreen', {screen: 'HomeScreen'});
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

  const onSubmit = (data: Post[]) => {
    mutation.mutate(data);
  };

  return (
    <SafeAreaView className="p-3 flex-1 bg-white dark:bg-black">
      <View className='dark:bg-black bg-white"'>
        <View className="w-full flex-row items-center bg-white dark:bg-black ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icons/close.png')}
              style={{
                width: 20,
                height: 20,
              }}
              tintColor={colorScheme === 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <Text
            className="pl-4 text-[20px] font-[500] text-black dark:text-white"
            onPress={() => initailableNewTread()}>
            New Thread
          </Text>
        </View>
      </View>
      <ScrollView>
        {fields.map((item, index) => (
          <View key={item.id}>
            <View className="mt-3 flex-row bg-white dark:bg-black">
              <Image
                source={{
                  uri: item.user.avatar
                    ? item.user.avatar
                    : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
                borderRadius={100}
              />
              <View className="pl-3 ">
                <View className="w-[65%] flex-row justify-between">
                  <Text className="text-black dark:text-white">
                    {item.user.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeThread(index)}>
                    <Image
                      source={require('../assets/icons/close.png')}
                      style={{
                        width: 15,
                        height: 15,
                      }}
                      tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                    />
                  </TouchableOpacity>
                </View>
                <Controller
                  control={control}
                  render={({field}) => (
                    <TextInput
                      value={field.value}
                      onChangeText={field.onChange}
                      className="text-black dark:text-white w-[60%]"
                      placeholder="Start a thread"
                      placeholderTextColor={'#eee'}
                      multiline
                    />
                  )}
                  name={`posts[${index}].title`}
                />

                <TouchableOpacity onPress={() => uploadImage(index)}>
                  {item.image ? (
                    <View className="m-2">
                      <Image
                        source={{uri: item.previewImage}}
                        width={200}
                        height={300}
                        resizeMethod="auto"
                        alt={`image ${index} of ${item.title}`}
                      />
                    </View>
                  ) : (
                    <Image
                      source={require('../assets/icons/upload.png')}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                      tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {index === fields.length - 1 && (
              <View
                className={`flex-row  w-full  mt-5 ${
                  item.title === '' && item.image === ''
                    ? 'opacity-70'
                    : 'opacity-100'
                } items-center `}>
                <Image
                  source={{
                    uri: item.user.avatar
                      ? item.user.avatar
                      : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderColor: 'white',
                    borderWidth: 2,
                  }}
                  borderRadius={100}
                />
                <Text
                  onPress={() => addNewThread()}
                  className="text-black dark:text-white pl-3">
                  Add new Thread
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Text className="text-red-600  ">Create Post</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({});
