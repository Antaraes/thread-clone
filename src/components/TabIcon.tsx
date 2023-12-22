// TabIcon.tsx

import {useColorScheme} from 'nativewind';
import React from 'react';
import {View, Text, Image} from 'react-native';

interface TabIconProps {
  icon: any;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({icon, focused}) => {
  const {colorScheme} = useColorScheme();
  const opacity = focused ? 1.0 : 0.4;
  return (
    <View>
      {/* Icon/Image can be added here */}
      <Image
        source={icon}
        style={{
          width: 30,
          height: 30,
          opacity,
          tintColor: colorScheme === 'dark' ? 'white' : 'black',
        }}
      />
    </View>
  );
};

export default TabIcon;
