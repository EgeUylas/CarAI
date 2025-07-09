import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function VehicleSettings() {
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [fuelType, setFuelType] = useState('');

  const handleSave = () => {
    // Firebase'e kaydetme işlemi burada yapılacak
    Alert.alert('Başarılı', 'Araç bilgileriniz güncellendi!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Araç Bilgileri</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plaka</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={setPlate}
            placeholder="34 ABC 123"
            placeholderTextColor="#666"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Marka</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Araç markası"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="Araç modeli"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yıl</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="Araç yılı"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Renk</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Araç rengi"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yakıt Tipi</Text>
          <TextInput
            style={styles.input}
            value={fuelType}
            onChangeText={setFuelType}
            placeholder="Benzin, Dizel, LPG, Elektrik"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity style={styles.addServiceButton}>
          <Feather name="plus-circle" size={20} color="#4ECDC4" />
          <Text style={styles.addServiceButtonText}>Servis Kaydı Ekle</Text>
        </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a252f',
    borderRadius: 10,
    padding: 15,
    color: '#FFF',
    fontSize: 16,
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a252f',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  addServiceButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    marginLeft: 10,
  },
}); 