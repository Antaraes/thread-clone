import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthStackNavigator from './navigations/AuthStackNavigator';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import useAuthStore from './zustand/AuthStore';
import AppStackNavigator from './navigations/AppStackNavigator';
import {QueryClient, QueryClientProvider} from 'react-query';
import {storage} from './zustand/MMKV';
const queryClient = new QueryClient();
function App() {
  const {isAuthenticated, setUser} = useAuthStore();
  const [userStore, setUserStore] = React.useState(storage.getString('user'));
  console.log('IsAuthenticated', isAuthenticated);
  console.log(process.env.SERVER_PORT);
  React.useEffect(() => {
    userStore && setUser(JSON.parse(userStore));
  }, [userStore]);
  return (
    <>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <AppStackNavigator />
        </QueryClientProvider>
        {/* <Provider store={store}> */}

        {/* </Provider> */}
      </NavigationContainer>
    </>
  );
}

export default App;
