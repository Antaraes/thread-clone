import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthStackNavigator from './navigations/AuthStackNavigator';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import useAuthStore from './zustand/AuthStore';
import AppStackNavigator from './navigations/AppStackNavigator';

function App() {
  const [isLogin, setIsLogin] = React.useState(false);
  const {isAuthenticated} = useAuthStore();
  console.log('IsAuthenticated', isAuthenticated);

  return (
    <>
      <NavigationContainer>
        {/* <Provider store={store}> */}

        <AuthStackNavigator />
        {/* </Provider> */}
      </NavigationContainer>
    </>
  );
}

export default App;
