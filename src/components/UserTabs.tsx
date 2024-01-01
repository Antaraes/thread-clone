import * as React from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar, Route} from 'react-native-tab-view';
import Threads from './Profile/Threads';
import Replies from './Profile/Replies';

interface UseTabsProps {
  scenes: Record<string, React.FC>;
  routes: Route[];
}

const UserTabs: React.FC<UseTabsProps> = ({scenes, routes}) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const renderScene = SceneMap(scenes);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: '#0000'}}
      labelStyle={{color: 'white'}}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

export default UserTabs;
