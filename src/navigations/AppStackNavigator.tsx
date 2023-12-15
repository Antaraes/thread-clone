import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignupScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList, RootStackParamList} from './type';
import HomeScreen from '@/screens/HomeScreen';

const AppStackNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
