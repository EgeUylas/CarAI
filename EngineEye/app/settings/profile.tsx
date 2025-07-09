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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, db, updateUserProfile } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileSettings() {
  const { colors } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setDisplayName(user.displayName || '');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || '');
          setPhoneNumber(userData.phoneNumber || '');
          setLocation(userData.location || '');
          setProfileImage(userData.profileImage || null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Hata', 'Galeriye erişim izni gerekiyor.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          setProfileImage(asset.uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const fileName = `profileImage_${user.uid}_${Date.now()}`;
      const storageRef = ref(storage, `profileImages/${fileName}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Hata', 'Lütfen ad soyad alanını doldurun.');
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      let imageUrl = profileImage;
      if (profileImage && !profileImage.startsWith('http')) {
        try {
          imageUrl = await uploadImage(profileImage);
        } catch (error) {
          console.error('Error uploading profile image:', error);
          Alert.alert('Uyarı', 'Profil resmi yüklenirken bir hata oluştu, diğer bilgileriniz kaydedilecek.');
          imageUrl = user.photoURL || null;
        }
      }

      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        photoURL: imageUrl,
        bio: bio.trim(),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
      });

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi!');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profil Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: colors.primary }]}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={[styles.profileImageContainer, { backgroundColor: colors.surface }]}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: colors.surface }]}>
              <Feather name="camera" size={30} color={colors.text} />
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.changePhotoText, { color: colors.primary }]}>Fotoğrafı Değiştir</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Ad Soyad</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Ad Soyad"
            placeholderTextColor={colors.secondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Hakkımda</Text>
          <TextInput
            style={[styles.input, styles.bioInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Kendinizden bahsedin..."
            placeholderTextColor={colors.secondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Telefon</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Telefon numarası"
            placeholderTextColor={colors.secondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Konum</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Şehir, Ülke"
            placeholderTextColor={colors.secondary}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 