import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignupScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList, RootStackParamList} from './type';
import HomeScreen from '@/screens/HomeScreen';
import AuthStackNavigator from './AuthStackNavigator';
import useAuthStore from '@/zustand/AuthStore';
import TabStackNavigator from './TabStackNavigator';
import {storage} from '@/zustand/MMKV';
import SettingScreen from '@/screens/SettingScreen';

const AppStackNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {isAuthenticated, setUser: setUserStore} = useAuthStore();
  const [user, setUser] = useState<User>(storage.getString('user'));
  console.log(user);
  return (
    <Stack.Navigator
      initialRouteName="AppScreen"
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <>
          <Stack.Screen name="AppScreen" component={TabStackNavigator} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} />
          <Stack.Screen name="AuthScreen" component={AuthStackNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="AuthScreen" component={AuthStackNavigator} />
          <Stack.Screen name="AppScreen" component={TabStackNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
