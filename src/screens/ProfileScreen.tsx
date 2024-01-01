import {
  Dimensions,
  Image,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {storage} from '@/zustand/MMKV';
import {useColorScheme} from 'nativewind';
import {AppScreenProps} from '@/navigations/type';
import useAuthStore from '@/zustand/AuthStore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator, Button} from 'react-native-paper';
import UserTabs from '@/components/UserTabs';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useQuery} from 'react-query';
import {GetUserDetails} from '@/api';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import Replies from '@/components/Profile/Replies';
import Threads from '@/components/Profile/Threads';

type Props = AppScreenProps<'ProfileScreen'>;

const ProfileScreen: FC<Props> = ({navigation, route}) => {
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [user, setUser] = useState<User>();
  const {dismiss} = useBottomSheetModal();
  const {
    user: userStore,
    startLoading,
    stopLoading,
    isLoading: loadingState,
  } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const snapPoints = ['50%'];

  const routes = [
    {key: 'threads', title: 'Connects'},
    {key: 'replies', title: 'Replies'},
  ];

  const scenes = {
    threads: Threads,
    replies: Replies,
  };
  console.log(userStore);
  const handlePresentModal = () => {
    bottomSheetModalRef.current?.present();
  };
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['userProfile'],
    queryFn: GetUserDetails,
    enabled: true,
  });
  useFocusEffect(
    React.useCallback(() => {
      if (data && data.data.user) {
        setUser(data.data.user || []);
      } else {
        setUser(userStore);
      }
    }, [data, userStore]),
  ),
    [];
  useEffect(() => {
    setUser(data?.data.user || userStore);
  }, [data]);

  const {width} = Dimensions.get('window');
  const handleLogout = () => {
    startLoading();
    storage.clearAll();

    console.log('Clear All');
    stopLoading();
    navigation.navigate('AuthScreen', {screen: 'LoginScreen'});
  };
  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  };
  const renderbackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );
  if (loadingState) {
    <View className="bg-[#F1F4F8] flex-1 dark:bg-[#070A0E] justify-center items-center">
      <ActivityIndicator animating={true} color={'#ffff'} />
    </View>;
  }
  if (isLoading) {
    return (
      <View className="bg-[#F1F4F8] flex-1 dark:bg-[#070A0E] justify-center items-center">
        <ActivityIndicator animating={true} color={'#ffff'} />
      </View>
    );
  }

  const BottomSheetBox = () => (
    <View className="flex-1 p-4">
      <Text className=" text-center text-black text-2xl mb-4 ">Settings</Text>
      <View className="flex-row gap-5 mb-3">
        <Image
          source={require('../assets/icons/invite.png')}
          style={{
            width: 25,
            height: 25,
          }}
        />
        <Text className="text-black">Follow and invite friends</Text>
      </View>

      <View className="flex-row gap-5 mb-3">
        <Image
          source={require('../assets/icons/privacy.png')}
          style={{
            width: 25,
            height: 25,
          }}
        />
        <Text className="text-black">Privacy</Text>
      </View>

      <View className="flex-row justify-between  mb-3">
        <View className="flex-row gap-5">
          <Image
            source={require('../assets/icons/brightness-and-contrast.png')}
            style={{
              width: 25,
              height: 25,
            }}
          />
          <Text className="text-black">
            {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>
        <Switch value={colorScheme == 'dark'} onChange={toggleColorScheme} />
      </View>
      <View className="flex-row gap-5 mb-3">
        <Image
          source={require('../assets/icons/information.png')}
          style={{
            width: 25,
            height: 25,
          }}
        />
        <Text className="text-black">About</Text>
      </View>
      <View
        style={{
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          paddingVertical: 10,
        }}>
        <TouchableHighlight onPress={() => handleLogout()}>
          <Text className="text-red-600 ">Logout</Text>
        </TouchableHighlight>
      </View>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-[#F1F4F8] dark:bg-[#070A0E] "
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#9Bd35A', '#689F38']}
        />
      }>
      <View className="flex-1">
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          backdropComponent={renderbackdrop}
          backgroundStyle={{
            backgroundColor: '#fff',
          }}
          handleIndicatorStyle={{
            backgroundColor: '#070A0E',
          }}
          snapPoints={snapPoints}>
          <BottomSheetBox />
        </BottomSheetModal>
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
        </View>

        {/* Profile  */}
        <View className="p-3 flex-1">
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
              {user && user?.followers.length} followers
            </Text>
            <Text className="text-xs text-[#888] dark:text-[#eeee]">
              {user && user?.following.length} following
            </Text>
          </View>
          <View className="flex-row gap-3 justify-around mt-2">
            <Button
              icon="camera"
              style={{width: '45%', borderColor: '#134876'}}
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
      </View>
      <UserTabs scenes={scenes} routes={routes} />
    </ScrollView>
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
