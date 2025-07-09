import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';

interface EmergencyService {
  id: string;
  title: string;
  icon: string;
  color: string;
  phone?: string;
  action: () => void;
}

export default function EmergencyScreen() {
  const [loading, setLoading] = useState(false);

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocation = () => {
    // Konum izni ve yakındaki servisleri bulma işlemleri burada yapılacak
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const emergencyServices: EmergencyService[] = [
    {
      id: 'ambulance',
      title: 'Ambulans',
      icon: 'plus-circle',
      color: '#E74C3C',
      phone: '112',
      action: () => handleCall('112'),
    },
    {
      id: 'tow',
      title: 'Çekici Çağır',
      icon: 'truck',
      color: '#8E44AD',
      phone: '0850XXX',
      action: () => handleCall('0850XXX'),
    },
    {
      id: 'mechanic',
      title: 'En Yakın Tamirci',
      icon: 'tool',
      color: '#3498DB',
      action: handleLocation,
    },
    {
      id: 'tire',
      title: 'En Yakın Lastikçi',
      icon: 'circle',
      color: '#2ECC71',
      action: handleLocation,
    },
    {
      id: 'gas',
      title: 'Yakın Benzin İstasyonları',
      icon: 'droplet',
      color: '#F1C40F',
      action: handleLocation,
    },
    {
      id: 'insurance',
      title: 'Sigorta Bildirimi',
      icon: 'file-text',
      color: '#9B59B6',
      action: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: '#E74C3C',
          },
          headerTintColor: '#fff',
          title: 'Acil Yardım',
        }}
      />

      {/* Acil Durum Numaraları */}
      <View style={styles.emergencyNumbers}>
        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: '#E74C3C' }]}
          onPress={() => handleCall('112')}
        >
          <Feather name="plus-circle" size={24} color="#FFF" />
          <Text style={styles.emergencyButtonText}>112</Text>
        </TouchableOpacity>
,

        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: '#27AE60' }]}
          onPress={() => handleCall('156')}
        >
          <Feather name="shield" size={24} color="#FFF" />
          <Text style={styles.emergencyButtonText}>156</Text>
        </TouchableOpacity>
      </View>

      {/* Servisler */}
      <ScrollView style={styles.services}>
        {emergencyServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={service.action}
          >
            <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
              <Feather name={service.icon as any} size={24} color="#FFF" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              {service.phone && (
                <Text style={styles.servicePhone}>{service.phone}</Text>
              )}
            </View>
            <Feather name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Yükleniyor Göstergesi */}
      {loading && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Yakındaki servisler aranıyor...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emergencyButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  emergencyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  services: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  servicePhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loading: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2ECC71',
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 