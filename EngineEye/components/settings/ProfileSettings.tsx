import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function ProfileSettings() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setBio(userData.bio || '');
        setPhoneNumber(userData.phoneNumber || '');
        setLocation(userData.location || '');
        setProfileImage(userData.profileImage || null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı');
        return;
      }

      const formattedUsername = username.toLowerCase();
      
      // Validate username format
      if (formattedUsername.length > 10) {
        Alert.alert('Hata', 'Kullanıcı adı en fazla 10 karakter olabilir.');
        return;
      }
      if (!/^[a-z0-9_]+$/.test(formattedUsername)) {
        Alert.alert('Hata', 'Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir.');
        return;
      }

      // Check if username is changed
      if (formattedUsername !== username) {
        // Check if username is already taken
        const usernameQuery = query(
          collection(db, 'users'),
          where('username', '==', formattedUsername)
        );
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (!usernameSnapshot.empty) {
          Alert.alert('Hata', 'Bu kullanıcı adı zaten kullanılıyor.');
          return;
        }
      }

      let imageUrl = null;
      if (profileImage && profileImage.startsWith('file://')) {
        imageUrl = await uploadImage(profileImage);
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        username: formattedUsername,
        bio,
        phoneNumber,
        location,
        ...(imageUrl && { profileImage: imageUrl }),
        updatedAt: new Date()
      });

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi!');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="user" size={40} color="#666" />
            </View>
          )}
          <View style={styles.editImageButton}>
            <Feather name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı adınız (max 10 karakter)"
            placeholderTextColor="#666"
            value={username}
            onChangeText={(text) => setUsername(text.toLowerCase())}
            maxLength={10}
            autoCapitalize="none"
          />
          <Text style={styles.inputHelper}>Sadece küçük harf, rakam ve alt çizgi (_) kullanabilirsiniz</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hakkımda</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Kendinizden bahsedin..."
            placeholderTextColor="#666"
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            placeholder="Telefon numaranız"
            placeholderTextColor="#666"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Konum</Text>
          <TextInput
            style={styles.input}
            placeholder="Yaşadığınız şehir"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1a252f',
    borderBottomWidth: 1,
    borderBottomColor: '#243240',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4ECDC4',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#243240',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    opacity: 0.7,
  },
  usernameText: {
    color: '#666',
    fontSize: 16,
  },
  inputHelper: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 