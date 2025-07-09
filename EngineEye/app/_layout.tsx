import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth, subscribeToAuthChanges } from '../firebase';
import { User } from 'firebase/auth';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { View, ActivityIndicator } from 'react-native';

function LoadingScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToAuthChanges((user: User | null) => {
        setIsAuthenticated(!!user);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth subscription error:', error);
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings/vehicle"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings/password"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
