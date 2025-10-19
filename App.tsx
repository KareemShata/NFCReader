import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import NFCReaderScreen from './screens/NFCReaderScreen';

/**
 * Type definition for the navigation stack
 * This defines all the screens and their parameters
 */
export type RootStackParamList = {
  Home: undefined;
  NFCReader: undefined;
};

// Create the navigation stack with type safety
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Component
 * 
 * This is the root component that sets up React Navigation.
 * It demonstrates:
 * - NavigationContainer: wraps the entire navigation tree
 * - Stack.Navigator: creates a stack-based navigation
 * - Stack.Screen: defines individual screens
 * - TypeScript types for type-safe navigation
 */
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'NFC Reader App',
          }}
        />
        <Stack.Screen
          name="NFCReader"
          component={NFCReaderScreen}
          options={{
            title: 'Scan Card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

