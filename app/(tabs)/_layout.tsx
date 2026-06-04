import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d4a843',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: 'transparent' },
        tabBarIcon: ({ color, size }) => {
          let label = '🏠';
          const r = route.name;
          if (r === 'index') label = '🏠';
          else if (r === 'browse') label = '📚';
          else if (r === 'share') label = '➕';
          else if (r === 'map') label = '🗺️';
          else if (r === 'community') label = '👥';
          return <Text style={{ color, fontSize: size }}>{label}</Text>;
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
