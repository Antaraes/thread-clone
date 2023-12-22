import {StyleSheet, Switch, Text, TouchableHighlight, View} from 'react-native';
import React, {FC} from 'react';
import {storage} from '@/zustand/MMKV';
import {useColorScheme} from 'nativewind';
import {
  AppScreenProps,
  AppStackParamList,
  AuthScreenProps,
  AuthStackParamList,
  RootStackParamList,
  RootStackScreenProps,
} from '@/navigations/type';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// type Props = {
//   navigation: CompositeNavigationProp<
//     NativeStackNavigationProp<AppStackParamList, 'ProfileScreen', undefined>,
//     NativeStackNavigationProp<
//       RootStackParamList,
//       keyof RootStackParamList,
//       undefined
//     >
//   >;
// };

type Props = RootStackScreenProps<'AppScreen'>;

const ProfileScreen: FC<Props> = ({navigation, route}) => {
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const handleLogout = () => {
    storage.clearAll();
    console.log('Clear All');
    navigation.navigate('AuthScreen', {screen: 'LoginScreen'});
  };
  return (
    <View className="flex-1 h-screen dark:bg-black bg-white">
      <Text>ProfileScreen</Text>
      <TouchableHighlight onPress={() => handleLogout()}>
        <Text className="text-black dark:text-white">Logout</Text>
      </TouchableHighlight>
      <Switch value={colorScheme == 'dark'} onChange={toggleColorScheme} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
