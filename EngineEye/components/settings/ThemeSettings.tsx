import React, { useState } from 'react';
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

const THEMES = [
  { id: 'dark', name: 'Koyu Tema', icon: 'moon' },
  { id: 'light', name: 'Açık Tema', icon: 'sun' },
  { id: 'system', name: 'Sistem Teması', icon: 'smartphone' },
];

const COLOR_SCHEMES = [
  { id: 'blue', name: 'Mavi', color: '#4ECDC4' },
  { id: 'purple', name: 'Mor', color: '#9B5DE5' },
  { id: 'green', name: 'Yeşil', color: '#96CEB4' },
  { id: 'red', name: 'Kırmızı', color: '#FF6B6B' },
  { id: 'orange', name: 'Turuncu', color: '#FF9A8B' },
];

export default function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [autoTheme, setAutoTheme] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSave = () => {
    // Tema ayarlarını kaydet
    Alert.alert('Başarılı', 'Tema ayarlarınız güncellendi!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tema Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tema Seçimi</Text>
        <View style={styles.themeContainer}>
          {THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeButton,
                selectedTheme === theme.id && styles.selectedTheme,
              ]}
              onPress={() => setSelectedTheme(theme.id)}
            >
              <Feather name={theme.icon as any} size={24} color="#FFF" />
              <Text style={styles.themeName}>{theme.name}</Text>
              {selectedTheme === theme.id && (
                <Feather name="check" size={20} color="#4ECDC4" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Renk Şeması</Text>
        <View style={styles.colorContainer}>
          {COLOR_SCHEMES.map((scheme) => (
            <TouchableOpacity
              key={scheme.id}
              style={[
                styles.colorButton,
                { backgroundColor: scheme.color },
                selectedColor === scheme.id && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(scheme.id)}
            >
              {selectedColor === scheme.id && (
                <Feather name="check" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Otomatik Tema</Text>
              <Text style={styles.optionDescription}>
                Gün içinde otomatik olarak tema değişsin
              </Text>
            </View>
            <Switch
              value={autoTheme}
              onValueChange={setAutoTheme}
              trackColor={{ false: '#1a252f', true: '#4ECDC4' }}
              thumbColor={autoTheme ? '#FFF' : '#666'}
            />
          </View>

          <View style={styles.optionItem}>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Azaltılmış Hareket</Text>
              <Text style={styles.optionDescription}>
                Animasyonları ve geçişleri azalt
              </Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: '#1a252f', true: '#4ECDC4' }}
              thumbColor={reducedMotion ? '#FFF' : '#666'}
            />
          </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  themeContainer: {
    marginBottom: 30,
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
  themeName: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    gap: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  optionDescription: {
    color: '#666',
    fontSize: 14,
  },
}); 