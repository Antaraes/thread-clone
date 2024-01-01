import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC, useRef} from 'react';
import {useColorScheme} from 'nativewind';
import getTimeDuration from '@/helper/timeDuration';
import {Post} from '@/type';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useAuthStore from '@/zustand/AuthStore';

type Props = {
  posts: Post[];
  refreshing: boolean;
  isLoading: boolean;
  onRefresh: () => void;
};

const ShowPosts: FC<Props> = ({posts, isLoading, refreshing, onRefresh}) => {
  const {colorScheme} = useColorScheme();
  const {user} = useAuthStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    listItemContainer: {
      marginTop: 10,
      paddingVertical: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      flexDirection: 'row',
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 100,
    },
    textContainer: {
      paddingLeft: 10,
      width: '80%',
    },
    userNameText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      textTransform: 'uppercase',
    },
    titleText: {
      paddingTop: 10,
      fontSize: 15,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    imageContainer: {
      marginTop: 2,
    },
    uploadIcon: {
      width: 20,
      height: 20,
      tintColor: colorScheme === 'dark' ? 'white' : 'black',
    },
  });
  const scrollY = useRef(new Animated.Value(0)).current;
  const ITEM_SIZE = 140;
  return (
    <Animated.FlatList
      data={posts as Post[]}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      })}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator animating={true} color={'white'} />
        ) : null
      }
      renderItem={({item, index}) => {
        const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
        const opacityInputRange = [
          -1,
          0,
          ITEM_SIZE * index,
          ITEM_SIZE * (index + 1),
        ];

        const scale = scrollY.interpolate({
          inputRange,
          outputRange: [1, 1, 1, 0],
        });
        const opacity = scrollY.interpolate({
          inputRange: opacityInputRange,
          outputRange: [1, 1, 1, 0],
        });

        return (
          <Animated.View
            key={item.title}
            style={{
              position: 'relative',
              marginTop: 10,
              paddingVertical: 10,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              flexDirection: 'row',
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
              transform: [{scale}],
              opacity,
            }}>
            <Image
              source={{
                uri: item.user.avatar
                  ? item.user.avatar
                  : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.textContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.userNameText}>{item.user.name}</Text>
                <View style={{flexDirection: 'row', gap: 20}}>
                  <Text>{getTimeDuration(item.createdAt)} ago</Text>
                  <TouchableOpacity>
                    <Text className="  text-2xl">...</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.titleText}>{item.title}</Text>
              {item.image !== null && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: item.image}}
                    width={300}
                    height={400}
                    resizeMethod="auto"
                    alt={`image ${index} of ${item.title}`}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  top: 5,
                  marginBottom: 5,
                }}>
                <TouchableOpacity>
                  {item.likes.length > 0 ? (
                    <>
                      {item.likes.find((i: any) => i.userId === user._id) ? (
                        <Image
                          source={require('../assets/icons/heartfull.png')}
                          tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                          style={{width: 25, height: 25}}
                        />
                      ) : (
                        <Image
                          source={require('../assets/icons/heartfull.png')}
                          tintColor={'red'}
                          style={{width: 25, height: 25}}
                        />
                      )}
                    </>
                  ) : (
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png',
                      }}
                      tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                      width={30}
                      height={30}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/5948/5948565.png',
                    }}
                    tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                    width={22}
                    height={22}
                    className="ml-5"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/3905/3905866.png',
                    }}
                    tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                    width={25}
                    height={25}
                    className="ml-5"
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/10863/10863770.png',
                    }}
                    tintColor={colorScheme === 'dark' ? 'white' : 'black'}
                    width={25}
                    height={25}
                    className="ml-5"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-[#ccc]">{item.likes.length} Likes</Text>
            </View>
          </Animated.View>
        );
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    />
  );
};

export default ShowPosts;
