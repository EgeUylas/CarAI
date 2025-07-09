import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';

const CLUBS = [
  {
    id: '1',
    name: 'Klasik Otomobil Kulübü',
    memberCount: 1234,
    description: 'Klasik arabaları seven ve koruyan bir topluluk',
    image: require('@/assets/images/araba3.jpg'),
  },
  {
    id: '2',
    name: 'Modifiye Tutkunları',
    memberCount: 2567,
    description: 'Modifiye ve performans odaklı araç sahipleri',
    image: require('@/assets/images/araba4.jpg'),
  },
  {
    id: '3',
    name: 'Elektrikli Araç Topluluğu',
    memberCount: 890,
    description: 'Elektrikli araç sahipleri ve meraklıları',
    image: require('@/assets/images/araba5.jpg'),
  },
];

export default function ClubsScreen() {
  return (
    <ScrollView style={styles.container}>
      {CLUBS.map((club) => (
        <View key={club.id} style={styles.clubCard}>
          <Image source={club.image} style={styles.clubImage} />
          <View style={styles.clubInfo}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.memberCount}>{club.memberCount} üye</Text>
            <Text style={styles.clubDescription}>{club.description}</Text>
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
  clubCard: {
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
  clubImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  clubInfo: {
    padding: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
    color: '#4ECDC4',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    color: '#96CEB4',
    lineHeight: 20,
  },
}); 