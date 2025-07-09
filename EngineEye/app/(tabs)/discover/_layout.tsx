import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../constants/Colors';

export default function DiscoverLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <Feather name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color }) => <Feather name="message-square" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Pazar',
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: 'Kulüpler',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Etkinlikler',
          tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'Videolar',
          tabBarIcon: ({ color }) => <Feather name="video" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 