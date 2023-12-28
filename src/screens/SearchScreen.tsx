import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {FC, useDeferredValue, useEffect, useState} from 'react';
import {useColorScheme} from 'nativewind';
import {AppScreenProps} from '@/navigations/type';
import {Button, Searchbar} from 'react-native-paper';
import {GetAllUsers, followAndUnfolllow} from '@/api';
import {useMutation, useQuery} from 'react-query';
import useAuthStore from '@/zustand/AuthStore';

type Props = AppScreenProps<'SearchSreen'>;
const SearchScreen: FC<Props> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {colorScheme} = useColorScheme();
  const onChangeSearch = (query: string) => setSearchQuery(query);

  const {data, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: GetAllUsers,
  });

  const [filterUserList, setFilterUserList] = useState<User[]>([]);
  const query = useDeferredValue(searchQuery);
  const {stopLoading, user} = useAuthStore();

  useEffect(() => {
    const filterUserList = data?.users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );

    setFilterUserList(filterUserList || []);
  }, [query, data]);

  const mutation = useMutation((data: string) => followAndUnfolllow(data), {
    onSuccess: async response => {
      // Assuming you want to stop loading here
      stopLoading();

      const userData = response?.data;

      console.log(userData);
      if (userData && userData.accessToken) {
        await ToastAndroid.showWithGravity(
          'Invalid response data',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        await ToastAndroid.showWithGravity(
          'Invalid response data',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    },
    onError: async error => {
      stopLoading();
      console.log(error);

      await ToastAndroid.showWithGravity(
        'Login Failed',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    },
    // Assuming you want to start loading here
    onSettled: () => {
      stopLoading();
    },
  });

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
          data={filterUserList}
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
              <Button
                mode="outlined"
                color={colorScheme === 'dark' ? 'white' : 'black'}
                onPress={() => mutation.mutate(item._id)}>
                Follow
              </Button>
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
