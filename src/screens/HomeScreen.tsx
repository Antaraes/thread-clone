import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {storage} from '@/zustand/MMKV';

const HomeScreen = () => {
  const [user, setUser] = useState(storage.getString('user'));
  // console.log('user', JSON.parse(user));
  return (
    <View className="flex-1 dark:bg-black h-screen">
      <Text className="text-black dark:text-white">HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
