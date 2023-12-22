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
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useAuthStore from '@/zustand/AuthStore';
import {AppScreenProps} from '@/navigations/type';
import {useColorScheme} from 'nativewind';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useMutation} from 'react-query';
import {CreatePost} from '@/api';

type Props = AppScreenProps<'CreatePostScreen'>;
const PostScreen: React.FC<Props> = ({navigation, route}) => {
  const {setAuth, setUser, startLoading, stopLoading, user} = useAuthStore();
  const {colorScheme} = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [post, setPost] = useState<Post[]>([
    {
      title: '',
      previewImage: '',
      image: '',
      user: user.user,
    },
  ]);
  console.log(activeIndex);
  const uploadImage = async (index: number) => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 200,
        height: 300,
        cropping: true,
        compressImageQuality: 1,
        includeBase64: true,
      });
      console.log(image.path);
      if (image) {
        setPost(prevPost => {
          const updatedPost = [...prevPost];
          updatedPost[index] = {
            ...updatedPost[index],
            image: image?.data,
            previewImage: 'data:image/jpeg;base64,' + image.data,
          };
          return updatedPost;
        });
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      return null;
    }
  };
  const handleTitleChange = (index: number, text: string) => {
    setPost(prevPost => {
      const updatedPost = [...prevPost];
      updatedPost[index] = {...updatedPost[index], title: text};
      return updatedPost;
    });
  };
  const removeThread = (index: number) => {
    if (post.length > 1) {
      const updatedPost = [...post];
      updatedPost.splice(index, 1);
      setPost(updatedPost);
      setActiveIndex(updatedPost.length - 1);
      return updatedPost;
    }
  };
  console.log('post.length', post.length);
  const addNewThread = () => {
    if (post[activeIndex].title !== '' || post[activeIndex].image !== '') {
      setPost(prevPost => [
        ...prevPost,
        {title: '', image: '', previewImage: '', user: user.user as User},
      ]);
      setActiveIndex(post.length);
    }
  };
  const mutation = useMutation((data: Post[]) => CreatePost(data), {
    onSuccess: async response => {
      startLoading();

      await ToastAndroid.showWithGravity(
        'Create Post Success',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setAuth();
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
  const createPost = () => {
    console.log(post);
    mutation.mutate(post);
  };

  return (
    <SafeAreaView className=" p-3 flex-1 bg-white dark:bg-black">
      <View className=' dark:bg-black bg-white"'>
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
          <Text className="pl-4 text-[20px] font-[500] text-black dark:text-white">
            New Thread
          </Text>
        </View>
      </View>
      <ScrollView>
        {post.map((item, index) => (
          <View key={index}>
            <View className="mt-3 flex-row bg-white dark:bg-black">
              <Image
                source={{
                  uri: item
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
                <View className="w-[70%] flex-row justify-between">
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
                <TextInput
                  className="text-black dark:text-white w-[60%]"
                  placeholder="Stat a thread"
                  placeholderTextColor={'#eee'}
                  value={item.title}
                  multiline
                  onChangeText={text => handleTitleChange(index, text)}
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
            {index === activeIndex && (
              <View
                className={`flex-row  w-full  mt-5 ${
                  item.title === '' && item.image === ''
                    ? 'opacity-70'
                    : 'opacity-100'
                } items-center `}>
                <Image
                  source={{
                    uri: item
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
                  onPress={addNewThread}
                  className="text-black dark:text-white pl-3">
                  Add new Thread
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={() => createPost()}>
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
