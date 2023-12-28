import * as React from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Threads from './Threads';
import Replies from './Replies';

const FirstRoute = () => <View style={{flex: 1, backgroundColor: '#ff4081'}} />;
const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);

const renderScene = SceneMap({
  threads: Threads,
  replies: Replies,
});

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: 'white'}}
    style={{backgroundColor: '#0000'}}
    labelStyle={{color: 'white'}}
  />
);

export default function UserTabs() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'threads', title: 'Connects'},
    {key: 'replies', title: 'Replies'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
}
