// import React, {useState} from 'react';
// import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import Home from '../screens/Home';

// import VolumePlay from '../screens/VolumePlay';
// import FlatListPage from '../screens/FlatListPage';
// import CRUD from '../screens/CRUD';
// import ImageUploader from '../screens/ImageUpload';
// import Tabs from '../screens/Tabs';

// export default function AppNavigator() {
//   const Stack = createStackNavigator();

//   return (
//     <>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           ...TransitionPresets.SlideFromRightIOS, // Smooth transition
//         }}>
//         <Stack.Screen name="Home" component={Home} />

//         <Stack.Screen name="VolumePlay" component={VolumePlay} />
//         <Stack.Screen name="FlatListPage" component={FlatListPage} />
//         <Stack.Screen name="CRUD" component={CRUD} />
//         <Stack.Screen name="ImageUpload" component={ImageUploader} />
//         <Stack.Screen name="Tabs" component={Tabs} />
//       </Stack.Navigator>
//     </>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (

    <Tab.Navigator initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'push' : 'push-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          // else if (route.name === 'OrderScreen') {
          //   iconName = focused ? 'document-text' : 'document-text-outline';
          // } else if (route.name === 'Account') {
          //   iconName = focused ? 'settings' : 'settings-outline';
          // }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
          height: 70,
          paddingBottom: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>

  );
}
