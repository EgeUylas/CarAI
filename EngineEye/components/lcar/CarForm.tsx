import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CarDetails } from './types';

interface CarFormProps {
  onSubmit: (data: CarDetails) => void;
  onClose: () => void;
  onEdit?: (data: CarDetails) => void;
  initialData?: CarDetails;
  isEditing?: boolean;
}

const { width } = Dimensions.get('window');

const INITIAL_STATE: CarDetails = {
  id: '',
  brand: '',
  model: '',
  year: '',
  mileage: '',
  plateNumber: '',
  isFavorite: false,
  insuranceDate: '',
  inspectionDate: '',
  trafficInsuranceDate: '',
  lastOilChange: { date: '', mileage: '' },
  lastTireChange: { date: '', mileage: '' },
  lastBrakeService: { date: '', mileage: '' },
  lastBatteryChange: '',
  lastFilterChange: '',
  fuelType: 'benzin',
  transmission: 'manuel',
};

export default function CarForm({ onSubmit, onClose, onEdit, initialData, isEditing = false }: CarFormProps) {
  const [formData, setFormData] = useState<CarDetails>(initialData || INITIAL_STATE);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<string>('');
  const [currentMaintenanceField, setCurrentMaintenanceField] = useState<string>('');

  const handleInputChange = (field: keyof CarDetails | string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [mainField, subField] = field.split('.');
        return {
          ...prev,
          [mainField]: {
            ...(prev[mainField as keyof CarDetails] as any),
            [subField]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (currentMaintenanceField) {
        handleInputChange(`${currentMaintenanceField}.date`, dateString);
      } else if (currentDateField) {
        handleInputChange(currentDateField, dateString);
      }
    }
  };

  const showDatePickerFor = (field: string, maintenanceField?: string) => {
    setCurrentDateField(field);
    setCurrentMaintenanceField(maintenanceField || '');
    setShowDatePicker(true);
  };

  const renderDateInput = (field: string, label: string, maintenanceField?: string) => {
    const value = maintenanceField 
      ? (formData[maintenanceField as keyof CarDetails] as any)?.date
      : formData[field as keyof CarDetails];

    return (
      <TouchableOpacity
        style={styles.dateInputGroup}
        onPress={() => showDatePickerFor(field, maintenanceField)}
      >
        <View style={styles.dateInputContent}>
          <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
          <Text style={[styles.dateInputText, !value && styles.placeholder]}>
            {value || label}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => isEditing ? onEdit?.(formData) : onSubmit(formData)}
          >
            <Text style={styles.saveButtonText}>{isEditing ? 'Güncelle' : 'Kaydet'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.formContent}>
        {/* Temel Bilgiler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Feather name="truck" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Marka"
              placeholderTextColor="#999"
              value={formData.brand}
              onChangeText={(text) => handleInputChange('brand', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="tag" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Model"
              placeholderTextColor="#999"
              value={formData.model}
              onChangeText={(text) => handleInputChange('model', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="hash" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Plaka"
              placeholderTextColor="#999"
              value={formData.plateNumber}
              onChangeText={(text) => handleInputChange('plateNumber', text.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.favoriteButton,
              formData.isFavorite && styles.favoriteButtonActive
            ]}
            onPress={() => handleInputChange('isFavorite', !formData.isFavorite)}
          >
            <Feather 
              name={formData.isFavorite ? "star" : "star"} 
              size={20} 
              color={formData.isFavorite ? "#FFD700" : "#666"} 
            />
            <Text style={[
              styles.favoriteButtonText,
              formData.isFavorite && styles.favoriteButtonTextActive
            ]}>
              Favori Aracım
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Yıl"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.year}
                onChangeText={(text) => handleInputChange('year', text)}
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfInput]}>
              <Feather name="navigation" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Kilometre"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.mileage}
                onChangeText={(text) => handleInputChange('mileage', text)}
              />
            </View>
          </View>
        </View>

        {/* Yasal Bilgiler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yasal Bilgiler</Text>
          {renderDateInput('insuranceDate', 'Kasko Bitiş Tarihi')}
          {renderDateInput('trafficInsuranceDate', 'Trafik Sigortası Bitiş Tarihi')}
          {renderDateInput('inspectionDate', 'Muayene Bitiş Tarihi')}
        </View>

        {/* Araç Detayları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Araç Detayları</Text>
          
          <View style={styles.pickerContainer}>
            <Feather name="droplet" size={20} color="#666" style={styles.inputIcon} />
            <Picker
              selectedValue={formData.fuelType}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('fuelType', value)}
            >
              <Picker.Item label="Benzin" value="benzin" />
              <Picker.Item label="Dizel" value="dizel" />
              <Picker.Item label="LPG" value="lpg" />
              <Picker.Item label="Elektrik" value="elektrik" />
              <Picker.Item label="Hibrit" value="hibrit" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Feather name="settings" size={20} color="#666" style={styles.inputIcon} />
            <Picker
              selectedValue={formData.transmission}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('transmission', value)}
            >
              <Picker.Item label="Manuel" value="manuel" />
              <Picker.Item label="Otomatik" value="otomatik" />
            </Picker>
          </View>
        </View>

        {/* Son Bakım Bilgileri */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Son Bakım Bilgileri</Text>
          {renderDateInput('lastOilChange', 'Son Yağ Değişimi Tarihi', 'lastOilChange')}
          {renderDateInput('lastTireChange', 'Son Lastik Değişimi Tarihi', 'lastTireChange')}
          {renderDateInput('lastBrakeService', 'Son Fren Bakımı Tarihi', 'lastBrakeService')}
          {renderDateInput('lastBatteryChange', 'Son Akü Değişimi Tarihi')}
          {renderDateInput('lastFilterChange', 'Son Filtre Değişimi Tarihi')}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateSelect}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#141F27',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  formContent: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: (width - 60) / 2,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  dateInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  placeholder: {
    color: '#999',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFD700',
  },
  favoriteButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 10,
  },
  favoriteButtonTextActive: {
    color: '#333',
  },
}); 