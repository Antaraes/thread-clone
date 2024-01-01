import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useColorScheme} from 'nativewind';
import UserTabs from '@/components/UserTabs';
import AllNotifaction from '@/components/Notfication/AllNotifaction';
import RepliesNotifaction from '@/components/Notfication/RepliesNotifaction';
import MentionNoti from '@/components/Notfication/MentionNoti';

const NotificationScreen = () => {
  const {colorScheme} = useColorScheme();
  const routes = [
    {key: 'all', title: 'All'},
    {key: 'replies', title: 'Replies'},
    {key: 'mentions', title: 'mentions'},
  ];
  const scenes = {
    all: AllNotifaction,
    replies: RepliesNotifaction,
    mentions: MentionNoti,
  };
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 24,
            color: colorScheme === 'dark' ? 'white' : 'black',
            marginBottom: 10,
          }}>
          Activity
        </Text>
        <UserTabs scenes={scenes} routes={routes} />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});
