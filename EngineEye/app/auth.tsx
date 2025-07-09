import React from 'react';
import { Stack } from 'expo-router';
import AuthScreen from '@/components/auth/AuthScreen';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Auth() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#141F27" />
      <Stack.Screen 
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#141F27'
          }
        }}
      />
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  }
}); 