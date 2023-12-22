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
import ProfileScreen from '@/screens/ProfileScreen';
import PostScreen from '@/screens/PostScreen';

const AppStackNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {isAuthenticated} = useAuthStore();
  const [user, setUser] = useState(storage.getString('user'));

  useEffect(() => {}, [user]);
  return (
    <Stack.Navigator
      initialRouteName="AuthScreen"
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <Stack.Screen name="AppScreen" component={TabStackNavigator} />
      ) : (
        <Stack.Screen name="AuthScreen" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
