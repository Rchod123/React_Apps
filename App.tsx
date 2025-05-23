import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StopWatchScreen from './src/screens/StopWatchScreen';
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import { ScreenHeader } from './src/components/Header';
import ToDoScreen from './src/screens/ToDoScreen';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          options={{
            header: ({navigation}) => (
             <ScreenHeader navigation ={navigation} theme={colorScheme??"light"}/>
            ),
          }}
          name="StopWatch"
          component={StopWatchScreen}
        />
        <Stack.Screen
          options={{
            header: ({navigation}) => (
              <ScreenHeader navigation={navigation} theme={colorScheme ?? "light"}/>
            ),
          }}
          name="Notes"
          component={NotesScreen}
        />
         <Stack.Screen
          options={{
            header: ({navigation}) => (
              <ScreenHeader navigation={navigation} theme={colorScheme ?? "light"}/>
            ),
          }}
          name="ToDo"
          component={ToDoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
