import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker, Button } from 'react-native';

const LanguageRegionScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [selectedRegion, setSelectedRegion] = useState('TR');

  const handleSave = () => {
    // Seçilen dil ve bölgeyi kaydetme işlemleri burada yapılabilir
    console.log(`Dil: ${selectedLanguage}, Bölge: ${selectedRegion}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dil ve Bölge Ayarları</Text>

      <Text style={styles.label}>Dil Seçin:</Text>
      <Picker
        selectedValue={selectedLanguage}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
      >
        <Picker.Item label="Türkçe" value="tr" />
        <Picker.Item label="İngilizce" value="en" />
        <Picker.Item label="Almanca" value="de" />
        {/* Diğer diller buraya eklenebilir */}
      </Picker>

      <Text style={styles.label}>Bölge Seçin:</Text>
      <Picker
        selectedValue={selectedRegion}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRegion(itemValue)}
      >
        <Picker.Item label="Türkiye" value="TR" />
        <Picker.Item label="Amerika" value="US" />
        <Picker.Item label="Almanya" value="DE" />
        {/* Diğer bölgeler buraya eklenebilir */}
      </Picker>

      <Button title="Kaydet" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#141F27',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
});

export default LanguageRegionScreen;
