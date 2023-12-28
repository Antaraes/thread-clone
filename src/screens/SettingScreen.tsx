import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {useColorScheme} from 'nativewind';
import {RootStackScreenProps} from '@/navigations/type';

type Props = RootStackScreenProps<'SettingScreen'>;
const SettingScreen: FC<Props> = ({navigation}) => {
  const {colorScheme} = useColorScheme();
  return (
    <View className="flex-1 bg-white dark:bg-black p-3">
      <View className="w-full flex-row items-center bg-white dark:bg-black ">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/close.png')}
            style={{
              width: 20,
              height: 20,
            }}
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <Text className="pl-4 text-[20px] font-[500] text-black dark:text-white">
          Setting
        </Text>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
