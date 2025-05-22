import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StopWatchScreen from './src/screens/StopWatchScreen';
import HomeScreen from './src/screens/HomeScreen';
import {Platform, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from './src/utils/ScreenSize';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          options={{
            header: ({navigation}) => (
              <SafeAreaView>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={[
                    Platform.OS === 'android' && {
                      marginTop: heightPercentageToDP(2),
                    },
                    {paddingLeft: widthPercentageToDP(5)},
                  ]}>
                  <Text>Home</Text>
                </TouchableOpacity>
              </SafeAreaView>
            ),
          }}
          name="StopWatch"
          component={StopWatchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
