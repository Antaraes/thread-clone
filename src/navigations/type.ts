import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeScreen: undefined;
  AuthScreen: NavigatorScreenParams<AuthStackParamList>;
};

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type SingleAuthScreenProps<A extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, A>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    SingleAuthScreenProps<T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// export type LoginScreenProps = CompositeScreenProps<NativeStackScreenProps<AuthStackParamList,'LoginScreen'>,AuthScreenProps>

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;
