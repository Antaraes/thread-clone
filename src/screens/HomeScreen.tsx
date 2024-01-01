import React, {useEffect, useState} from 'react';
import {storage} from '@/zustand/MMKV';
import {useQuery} from 'react-query';
import {GetPosts} from '@/api';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useColorScheme} from 'nativewind';
import ShowPosts from '@/components/ShowPosts';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, View} from 'react-native';

const HomeScreen = () => {
  const [user, setUser] = useState(storage.getString('user'));
  const [posts, setPosts] = useState([]);
  const {colorScheme} = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const {data, isLoading, refetch} = useQuery({
    queryKey: 'Posts',
    queryFn: GetPosts,
  });

  useFocusEffect(
    React.useCallback(() => {
      setPosts(data?.data.posts || []);
    }, [data]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  };

  if (isLoading) {
    // If data is still loading, display a loading indicator or any other UI
    return (
      <View className="bg-white dark:bg-black flex-1 justify-center items-center">
        <ActivityIndicator animating={true} color={'#ffff'} size={20} />
      </View>
    );
  }

  return (
    <ShowPosts
      isLoading={isLoading}
      onRefresh={onRefresh}
      posts={posts}
      refreshing={refreshing}
    />
  );
};

export default HomeScreen;
