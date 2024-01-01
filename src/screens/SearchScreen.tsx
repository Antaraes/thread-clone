import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useDeferredValue, useEffect, useState} from 'react';
import {useColorScheme} from 'nativewind';
import {AppScreenProps} from '@/navigations/type';
import {Button, Searchbar} from 'react-native-paper';
import {GetAllUsers, followAndUnfolllow} from '@/api';
import {useMutation, useQuery} from 'react-query';
import useAuthStore from '@/zustand/AuthStore';
import {RefreshControl} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

type Props = AppScreenProps<'SearchSreen'>;
const SearchScreen: FC<Props> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {colorScheme} = useColorScheme();
  const onChangeSearch = (query: string) => setSearchQuery(query);

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['users'],
    queryFn: GetAllUsers,
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [filterUserList, setFilterUserList] = useState<User[]>([]);
  const query = useDeferredValue(searchQuery);
  const {stopLoading, user} = useAuthStore();
  useFocusEffect(
    React.useCallback(() => {
      setFilterUserList(data?.users || []);
    }, [data]),
  );

  useEffect(() => {
    if (data) {
      const filterUserList = data?.users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );

      setFilterUserList(filterUserList || []);
    }
  }, [query, data]);
  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  };
  const followMutation = useMutation(
    (data: FollowAndUnfolllow) => followAndUnfolllow(data),
    {
      onSuccess: async response => {
        // Assuming you want to stop loading here
        stopLoading();
        console.log('data follow', data);

        const userData = response?.data;

        if (userData && userData.accessToken) {
          await ToastAndroid.showWithGravity(
            'Successfully Created',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      },
      onError: async error => {
        stopLoading();
        console.log(error);

        await ToastAndroid.showWithGravity(
          'Follow Failed',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      },
      // Assuming you want to start loading here
      onSettled: () => {
        stopLoading();
      },
    },
  );
  const handleFollow = async (value: string) => {
    setFilterUserList(prevUsers => {
      return prevUsers.map(user => {
        if (user._id === value) {
          // Toggle the follow status optimistically
          return {...user, isFollowing: !user.following};
        }
        return user;
      });
    });
    followMutation.mutate({userId: value});
  };
  if (isLoading) {
    return (
      <View className="bg-white dark:bg-black">
        <ActivityIndicator animating={true} color={'#ffff'} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 24,
            color: colorScheme === 'dark' ? 'white' : 'black',
            marginBottom: 10,
          }}>
          Search
        </Text>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          icon={require('@/assets/icons/search.png')}
          style={{
            width: '95%',
            margin: 'auto',
            borderRadius: 50,
            backgroundColor: '#eeee',
          }}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filterUserList as User[]}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#888',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: item.avatar
                      ? item.avatar
                      : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 100,
                  }}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={{
                      color: colorScheme === 'dark' ? 'white' : 'black',
                      textTransform: 'uppercase',
                    }}>
                    {item?.name}
                  </Text>
                  <Text style={{fontSize: 12, color: '#888'}}>
                    {item?.followers.length > 0
                      ? `${item.followers.length} followers`
                      : '0 followers'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 30,
                  borderColor: colorScheme === 'dark' ? 'white' : 'black',
                }}
                onPress={() => handleFollow(item._id)}>
                <Text className="text-black dark:text-[#F6F8F9]">
                  {item.followers.find(
                    followedUser => followedUser.userId === user._id,
                  )
                    ? 'Following'
                    : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.avatar}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});
