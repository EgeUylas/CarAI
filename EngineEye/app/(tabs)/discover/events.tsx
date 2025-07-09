import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';

const EVENTS = [
  {
    id: '1',
    title: 'Klasik Araba Festivali',
    date: '15 Haziran 2024',
    location: 'İstanbul',
    image: require('@/assets/images/araba1.jpg'),
  },
  {
    id: '2',
    title: 'Modifiye Buluşması',
    date: '22 Haziran 2024',
    location: 'Ankara',
    image: require('@/assets/images/araba2.jpg'),
  },
];

export default function EventsScreen() {
  return (
    <ScrollView style={styles.container}>
      {EVENTS.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <Image source={event.image} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#1a252f',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#4ECDC4',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#96CEB4',
  },
}); 