import React from 'react';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './store';
export type IproviderProps = {
  children: React.ReactNode;
};

const ReduxProvider: React.FC<IproviderProps> = ({children}) => {
  return <Provider store={store}>{children}</Provider>;
};

export {ReduxProvider};
