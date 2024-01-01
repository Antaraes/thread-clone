import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import {GetAllNotifications} from '@/api';
import {useColorScheme} from 'nativewind';
import getTimeDuration from '@/helper/timeDuration';
import {useFocusEffect} from '@react-navigation/native';

const NotificationItem = ({item}) => {
  const {colorScheme} = useColorScheme();
  const timeDuration = getTimeDuration(item.createdAt);

  const styles = StyleSheet.create({
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    notificationTextContainer: {
      flex: 1,
    },
    notificationText: {
      color: '#888888',
      fontSize: 16,
    },
    userName: {
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
  });
  return (
    <View style={styles.notificationItem}>
      <Image
        source={{
          uri: item.creator.avatar
            ? item.creator.avatar
            : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
        }}
        style={styles.avatar}
      />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.userName}>{item.creator.name}</Text>
        <Text style={styles.notificationText}>
          {item.title} {timeDuration} ago
        </Text>
      </View>
    </View>
  );
};

const AllNotification = () => {
  const {colorScheme} = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [notification, setNotfication] = useState([]);
  const {
    data: noti,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: 'notfications',
    queryFn: GetAllNotifications,
  });
  useFocusEffect(
    React.useCallback(() => {
      setNotfication(noti?.data.user || []);
    }, [noti]),
  ),
    [];
  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={'#ffff'} />
      </View>
    );
  }
  console.log(noti?.data);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colorScheme === 'dark' ? 'black' : 'white'},
      ]}>
      <FlatList
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator animating={true} color={'white'} />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={noti?.data.notifications}
        keyExtractor={item => item._id}
        renderItem={({item}) => <NotificationItem item={item} />}
      />
    </View>
  );
};

export default AllNotification;
