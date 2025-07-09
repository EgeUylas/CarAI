import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CarStatus {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

const carStatuses: CarStatus[] = [
  { title: 'Genel Durum', value: 'İyi', icon: 'check-circle', color: '#4ECDC4' },
  { title: 'Motor', value: 'Normal', icon: 'activity', color: '#FFB347' },
  { title: 'Yakıt', value: '%65', icon: 'droplet', color: '#45B7D1' },
  { title: 'Lastikler', value: 'İyi', icon: 'disc', color: '#96CEB4' },
];

export default function CarCondition() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Feather name="bar-chart-2" size={20} color="#4ECDC4" />
            <Text style={styles.title}>Araç Durumu</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Feather name="refresh-cw" size={18} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {carStatuses.map((status, index) => (
            <View key={index} style={styles.statusItem}>
              <View style={[styles.iconContainer, { backgroundColor: status.color + '20' }]}>
                <Feather name={status.icon} size={24} color={status.color} />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>{status.title}</Text>
                <Text style={styles.statusValue}>{status.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Detaylı Rapor</Text>
          <Feather name="chevron-right" size={20} color="#4ECDC4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#1a252f',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    backgroundColor: '#243240',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusInfo: {
    marginTop: 4,
  },
  statusTitle: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  statusValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#243240',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  detailsButtonText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
