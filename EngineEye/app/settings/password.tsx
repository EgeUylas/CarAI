import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '../../firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useTheme } from '../../contexts/ThemeContext';

export default function PasswordSettings() {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır');
        return;
      }

      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Hata', 'Mevcut şifreniz yanlış');
      } else {
        console.error('Password update error:', error);
        Alert.alert('Hata', 'Şifre güncellenirken bir hata oluştu');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Şifre Değiştir</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: colors.primary }]}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Mevcut Şifre</Text>
          <View style={[styles.passwordInput, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mevcut şifrenizi girin"
              placeholderTextColor={colors.secondary}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showCurrentPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Yeni Şifre</Text>
          <View style={[styles.passwordInput, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Yeni şifrenizi girin"
              placeholderTextColor={colors.secondary}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showNewPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Yeni Şifre (Tekrar)</Text>
          <View style={[styles.passwordInput, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifrenizi tekrar girin"
              placeholderTextColor={colors.secondary}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.infoText, { color: colors.secondary }]}>
          Şifreniz en az 6 karakter uzunluğunda olmalıdır.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  infoText: {
    fontSize: 14,
    marginTop: 10,
  },
}); 