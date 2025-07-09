import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const LANGUAGES = [
  { id: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
];

const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
  "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu",
  "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
  "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir",
  "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
  "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
  "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
  "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
  "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
  "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
  "Kilis", "Osmaniye", "Düzce"
];

export default function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCities, setShowCities] = useState(false);

  const handleSave = () => {
    // Burada dil ve şehir ayarları kaydedilecek
    Alert.alert('Başarılı', 'Dil ve bölge ayarlarınız güncellendi!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dil ve Bölge</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Dil Seçimi</Text>
        <View style={styles.languageContainer}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.languageButton,
                selectedLanguage === language.id && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLanguage(language.id)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text style={[
                styles.languageName,
                selectedLanguage === language.id && styles.selectedLanguageText,
              ]}>
                {language.name}
              </Text>
              {selectedLanguage === language.id && (
                <Feather name="check" size={20} color="#4ECDC4" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Şehir Seçimi</Text>
        <TouchableOpacity
          style={styles.citySelector}
          onPress={() => setShowCities(!showCities)}
        >
          <Text style={styles.selectedCityText}>
            {selectedCity || 'Şehir seçiniz'}
          </Text>
          <Feather
            name={showCities ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#FFF"
          />
        </TouchableOpacity>

        {showCities && (
          <View style={styles.citiesList}>
            {CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityItem,
                  selectedCity === city && styles.selectedCity,
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  setShowCities(false);
                }}
              >
                <Text style={[
                  styles.cityText,
                  selectedCity === city && styles.selectedCityItemText,
                ]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  languageContainer: {
    marginBottom: 30,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLanguage: {
    backgroundColor: '#243240',
    borderColor: '#4ECDC4',
    borderWidth: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  selectedLanguageText: {
    color: '#4ECDC4',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedCityText: {
    color: '#FFF',
    fontSize: 16,
  },
  citiesList: {
    backgroundColor: '#1a252f',
    borderRadius: 10,
    maxHeight: 300,
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#243240',
  },
  selectedCity: {
    backgroundColor: '#243240',
  },
  cityText: {
    color: '#FFF',
    fontSize: 16,
  },
  selectedCityItemText: {
    color: '#4ECDC4',
  },
}); 