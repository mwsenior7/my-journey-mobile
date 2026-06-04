import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d4a843',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: 'transparent' },
        tabBarIcon: ({ color, size }) => {
          let name: any = 'home';
          const r = route.name;
          if (r === 'index') name = 'home';
          else if (r === 'browse') name = 'book';
          else if (r === 'share') name = 'add';
          else if (r === 'map') name = 'map';
          else if (r === 'community') name = 'people';
          return <MaterialIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse Stories' }} />
      <Tabs.Screen name="share" options={{ title: 'Share Your Story' }} />
      <Tabs.Screen name="map" options={{ title: 'Journey Map' }} />
      <Tabs.Screen name="community" options={{ title: 'Community Hubs' }} />
    </Tabs>
  );
}
