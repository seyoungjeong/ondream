import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NoticesScreen from '../screens/NoticesScreen';
import BoardScreen from '../screens/BoardScreen';
import FaqScreen from '../screens/FaqScreen';
import CounselingScreen from '../screens/CounselingScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Notices" component={NoticesScreen} />
        <Tab.Screen name="Board" component={BoardScreen} />
        <Tab.Screen name="FAQ" component={FaqScreen} />
        <Tab.Screen name="Counseling" component={CounselingScreen} />
        <Tab.Screen name="My Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
