import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthStackNavigator from './navigations/AuthStackNavigator';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import 'react-native-gesture-handler';
import useAuthStore from './zustand/AuthStore';
import AppStackNavigator from './navigations/AppStackNavigator';
import {QueryClient, QueryClientProvider, useQuery} from 'react-query';
import {storage} from './zustand/MMKV';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
const queryClient = new QueryClient();
function App() {
  const {isAuthenticated, setUser, user} = useAuthStore();
  const [userStore, setUserStore] = React.useState<User>(
    storage.getString('user'),
  );
  React.useEffect(() => {
    return userStore && setUser(JSON.parse(userStore));
  }, [userStore]);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <AppStackNavigator />
            </QueryClientProvider>
            {/* <Provider store={store}> */}

            {/* </Provider> */}
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
