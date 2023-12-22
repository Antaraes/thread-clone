import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignupScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from './type';
import AppStackNavigator from './AppStackNavigator';

const AuthStackNavigator = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
