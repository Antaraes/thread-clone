import {
  Dimensions,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {storage} from '@/zustand/MMKV';
import {useColorScheme} from 'nativewind';
import {AppScreenProps} from '@/navigations/type';
import useAuthStore from '@/zustand/AuthStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-paper';
import UserTabs from '@/components/Profile/UserTabs';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useQuery} from 'react-query';
import {GetUserDetails} from '@/api';
import {useFocusEffect} from '@react-navigation/native';

type Props = AppScreenProps<'ProfileScreen'>;

const ProfileScreen: FC<Props> = ({navigation, route}) => {
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const bottomSheetModalRef = useRef(null);
  const [user, setUser] = useState<User>();
  const snapPoints = ['100%'];

  const handlePresentModal = () => {
    bottomSheetModalRef.current?.present();
  };
  // const {user} = useAuthStore();
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['user'],
    queryFn: GetUserDetails,
  });

  useFocusEffect(() => {
    setUser(data?.data.user);
  }, [data]);

  console.log('ProfileScreen', data?.data.user.avatar);
  const {width} = Dimensions.get('window');
  const handleLogout = () => {
    storage.clearAll();
    console.log('Clear All');
    navigation.navigate('AuthScreen', {screen: 'LoginScreen'});
  };
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header  */}
      <View style={styles.header}>
        <View>
          <Image
            source={require('../assets/icons/world.png')}
            style={{
              width: 20,
              height: 20,
            }}
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </View>
        <BottomSheetModalProvider>
          <TouchableHighlight onPress={() => handlePresentModal()}>
            <Image
              source={require('../assets/icons/settings.png')}
              style={{
                width: 20,
                height: 20,
              }}
              tintColor={colorScheme === 'dark' ? 'white' : 'black'}
            />
          </TouchableHighlight>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}>
            <View>
              <Text>Hello</Text>
            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>

      {/* Profile  */}
      <View className="p-3">
        <View
          className="w-[95%]   flex-row mx-auto justify-between"
          style={{width: width - 20}}>
          <View>
            <Text className="text-black dark:text-white text-2xl uppercase">
              {user?.name}
            </Text>
            <Text className="text-[#888] dark:text-[#eeee] text-lg ">
              {user?.email}
            </Text>
            <Text className="text-[#9999]  dark:text-[#eeee] text-lg ">
              bio
            </Text>
          </View>
          <Image
            source={{
              uri: user?.avatar
                ? user.avatar
                : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
            }}
            height={70}
            width={70}
            borderRadius={100}
          />
        </View>
        <View>
          <Text className="text-xs text-[#888] dark:text-[#eeee]">
            {user?.followers.length} followers
          </Text>
          <Text className="text-xs text-[#888] dark:text-[#eeee]">
            {user?.following.length} following
          </Text>
        </View>
        <View className="flex-row gap-3 justify-around mt-2">
          <Button
            icon="camera"
            style={{width: '45%'}}
            mode="outlined"
            textColor={colorScheme === 'dark' ? 'white' : 'black'}
            onPress={() => console.log('Pressed')}>
            Edit Profile
          </Button>
          <Button
            icon="camera"
            style={{width: '45%'}}
            mode="outlined"
            textColor={colorScheme === 'dark' ? 'white' : 'black'}
            onPress={() => console.log('Pressed')}>
            Share Profile
          </Button>
        </View>
      </View>
      <UserTabs />
      <TouchableHighlight onPress={() => handleLogout()}>
        <Text className="text-black dark:text-white">Logout</Text>
      </TouchableHighlight>
      <Switch value={colorScheme == 'dark'} onChange={toggleColorScheme} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
