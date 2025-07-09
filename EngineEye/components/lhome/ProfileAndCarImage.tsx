import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const ProfileAndCarImage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [carImage, setCarImage] = useState<string | null>(null);

  const pickImage = async (type: 'profile' | 'car') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Fotoğraf seçebilmek için galeri izni gerekiyor.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (type === 'profile') {
          setProfileImage(result.assets[0].uri);
        } else {
          setCarImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil ve Araç</Text>
          <TouchableOpacity onPress={() => Alert.alert('Bilgi', 'Profil ve araç resimlerinizi buradan yönetebilirsiniz.')}>
            <Feather name="info" size={20} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profil Resmi */}
          <TouchableOpacity 
            style={styles.profileSection}
            onPress={() => pickImage('profile')}
          >
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Feather name="user" size={40} color="#4ECDC4" />
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#FFF" />
              </View>
            </View>
            <Text style={styles.label}>Profil Fotoğrafı</Text>
          </TouchableOpacity>

          {/* Araç Resmi */}
          <TouchableOpacity 
            style={styles.carSection}
            onPress={() => pickImage('car')}
          >
            <View style={styles.carImageContainer}>
              {carImage ? (
                <Image source={{ uri: carImage }} style={styles.carImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Feather name="camera" size={40} color="#4ECDC4" />
                  <Text style={styles.placeholderText}>Araç Fotoğrafı Ekle</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    alignItems: 'center',
    width: '30%',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  carSection: {
    width: '65%',
  },
  carImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#4ECDC4',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4ECDC4',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileAndCarImage;
 