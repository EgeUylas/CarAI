import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';

const MARKETPLACE = [
  {
    id: '1',
    title: '2018 BMW M4 Competition',
    price: '1.850.000 TL',
    location: 'İstanbul',
    image: require('@/assets/images/araba4.jpg'),
  },
  {
    id: '2',
    title: '2020 Mercedes AMG C63s',
    price: '2.250.000 TL',
    location: 'Ankara',
    image: require('@/assets/images/araba5.jpg'),
  },
  {
    id: '3',
    title: '2019 Porsche 911 GT3',
    price: '4.500.000 TL',
    location: 'İzmir',
    image: require('@/assets/images/araba6.jpg'),
  },
];

export default function MarketplaceScreen() {
  return (
    <ScrollView style={styles.container}>
      {MARKETPLACE.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
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
  itemCard: {
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
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#4ECDC4',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#96CEB4',
  },
}); 