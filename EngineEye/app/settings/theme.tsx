import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const THEMES = [
  { id: 'dark', name: 'Koyu Tema', icon: 'moon' },
  { id: 'light', name: 'Açık Tema', icon: 'sun' },
  { id: 'system', name: 'Sistem Teması', icon: 'smartphone' },
] as const;

const COLOR_SCHEMES = [
  { id: 'blue', color: '#4ECDC4', name: 'Mavi' },
  { id: 'purple', color: '#9B59B6', name: 'Mor' },
  { id: 'green', color: '#2ECC71', name: 'Yeşil' },
  { id: 'orange', color: '#E67E22', name: 'Turuncu' },
  { id: 'red', color: '#E74C3C', name: 'Kırmızı' },
] as const;

export default function ThemeSettings() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  const isSystemTheme = theme === 'system';

  const handleSave = () => {
    Alert.alert('Başarılı', 'Tema ayarlarınız güncellendi!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tema Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Otomatik Tema</Text>
          <View style={styles.autoThemeContainer}>
            <Text style={styles.autoThemeText}>Sistem temasını kullan</Text>
            <Switch
              value={isSystemTheme}
              onValueChange={(value) => setTheme(value ? 'system' : 'dark')}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={isSystemTheme ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {!isSystemTheme && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tema Seçimi</Text>
            {THEMES.filter(t => t.id !== 'system').map((themeOption) => (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeButton,
                  theme === themeOption.id && styles.selectedTheme,
                ]}
                onPress={() => setTheme(themeOption.id)}
              >
                <Feather name={themeOption.icon} size={24} color="#FFF" style={styles.themeIcon} />
                <Text style={styles.themeName}>{themeOption.name}</Text>
                {theme === themeOption.id && (
                  <Feather name="check" size={20} color="#4ECDC4" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Renk Şeması</Text>
          <View style={styles.colorGrid}>
            {COLOR_SCHEMES.map((scheme) => (
              <TouchableOpacity
                key={scheme.id}
                style={[
                  styles.colorButton,
                  { backgroundColor: scheme.color },
                  colorScheme === scheme.id && styles.selectedColor,
                ]}
                onPress={() => setColorScheme(scheme.id)}
              >
                {colorScheme === scheme.id && (
                  <Feather name="check" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.colorLabels}>
            {COLOR_SCHEMES.map((scheme) => (
              <Text key={scheme.id} style={styles.colorLabel}>
                {scheme.name}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  autoThemeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
  },
  autoThemeText: {
    color: '#FFF',
    fontSize: 16,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedTheme: {
    backgroundColor: '#243240',
    borderColor: '#4ECDC4',
    borderWidth: 1,
  },
  themeIcon: {
    marginRight: 15,
  },
  themeName: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFF',
  },
  colorLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorLabel: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    width: 50,
  },
}); 