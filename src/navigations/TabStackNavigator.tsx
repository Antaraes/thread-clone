// TabStackNavigator.tsx

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import {AppStackParamList} from './type';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import TabIcon from '@/components/TabIcon';
import SearchScreen from '@/screens/SearchScreen';
import PostScreen from '@/screens/PostScreen';
import NotificationScreen from '@/screens/NotificationScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useColorScheme} from 'nativewind';

type Props = {};

const Tab = createBottomTabNavigator<AppStackParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

const TabStackNavigator: React.FC<Props> = props => {
  const {colorScheme} = useColorScheme();
  const [barClose, setBarClose] = useState(false);
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          height: 60,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={require('../assets/icons/home.png')}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="SearchSreen"
        component={SearchScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={require('../assets/icons/search.png')}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="CreatePostScreen"
        component={PostScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={require('../assets/icons/writing.png')}
              focused={focused}
            />
          ),
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={require('../assets/icons/heart.png')}
              focused={focused}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={require('../assets/icons/user.png')}
              focused={focused}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default TabStackNavigator;