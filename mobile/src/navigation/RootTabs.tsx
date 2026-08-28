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
        <Tab.Screen name="Notices" component={NoticesScreen} options={{ tabBarLabel: '공지사항' }} />
        <Tab.Screen name="Board" component={BoardScreen} options={{ tabBarLabel: '게시판' }} />
        <Tab.Screen name="FAQ" component={FaqScreen} options={{ tabBarLabel: '자주 묻는 질문' }} />
        <Tab.Screen name="Counseling" component={CounselingScreen} options={{ tabBarLabel: '상담' }} />
        <Tab.Screen name="My Account" component={AccountScreen} options={{ tabBarLabel: '마이페이지' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
