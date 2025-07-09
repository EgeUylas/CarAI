import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { loginUser, registerUser } from '../../firebase';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('ege111@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!isLogin && !username) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı girin.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = isLogin
        ? await loginUser(email, password)
        : await registerUser(email, password, username);

      if (error) {
        // Hata koduna göre mesajı ayarlayabilirsiniz.
        let errorMessage = '';
        if (error.code === 'auth/wrong-password') {
          errorMessage = 'Şifreniz yanlış.';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
        } else {
          errorMessage = error.message || 'Bir hata oluştu.';
        }
        Alert.alert('Hata', errorMessage);
        return;
      }

      if (user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="car-sport" size={48} color="#4ECDC4" />
          </View>
          <Text style={styles.title}>PiAraba</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#4ECDC4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#4ECDC4" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#4ECDC4" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alternateButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.alternateButtonText}>
              {isLogin
                ? 'Hesabınız yok mu? Kayıt olun'
                : 'Zaten hesabınız var mı? Giriş yapın'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="#FFF" />
            <Text style={styles.socialButtonText}>
              {isLogin ? 'Google ile Giriş Yap' : 'Google ile Kayıt Ol'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a252f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a252f',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alternateButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  alternateButtonText: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#243240',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#243240',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
  },
  socialButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
}); 