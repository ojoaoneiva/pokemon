import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/pages/login';
import Custom from './src/pages/custom';
import Originals from './src/pages/originals';
import Header from './src/components/Header';
import SignUp from './src/pages/signUp';

const Stack = createNativeStackNavigator();

export default function App () {
  return (
    <NavigationContainer>
      <Header/>
      <Stack.Navigator initialRouteName="Originals">
        <Stack.Screen
          name="Originals"
          component={Originals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Custom"
          component={Custom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};