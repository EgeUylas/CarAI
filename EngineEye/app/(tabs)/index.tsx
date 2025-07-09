import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import WeatherComponent from '@/components/lhome/WeatherComponent';
import ProfileAndCarImage from '@/components/lhome/ProfileAndCarImage';
import * as NavigationBar from 'expo-navigation-bar';
import CarCondition from '@/components/lhome/CarCondition';
//import { supabase } from '/utils/supabase';
export default function Index() {
  useEffect(() => {
    // Gezinme çubuğu arka plan rengini ayarla
    NavigationBar.setBackgroundColorAsync('#141F27'); // Uygulama ile aynı renk
    // Gezinme çubuğu simge rengini ayarla
    NavigationBar.setButtonStyleAsync('light'); // Simge rengi açık
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#141F27" />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <WeatherComponent />
        <View style={styles.bosluk} />
        <ProfileAndCarImage />
        <View style={styles.bosluk} />
        <CarCondition />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
  },
  bosluk: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 30,
  },
});
