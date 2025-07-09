import React from 'react';
import { View, StyleSheet } from 'react-native';
import CarAddForm from '@/components/lcar/CarAddForm';
import { Stack } from 'expo-router';

export default function CarScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Araçlarım',
          headerStyle: {
            backgroundColor: '#141F27',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />
      <CarAddForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
});
