import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="vehicle"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 