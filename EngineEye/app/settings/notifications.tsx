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

const NOTIFICATION_SETTINGS = [
  {
    id: 'pushNotifications',
    title: 'Anlık Bildirimler',
    description: 'Uygulama bildirimleri',
  },
  {
    id: 'emailNotifications',
    title: 'E-posta Bildirimleri',
    description: 'E-posta ile bildirimler',
  },
  {
    id: 'smsNotifications',
    title: 'SMS Bildirimleri',
    description: 'SMS ile bildirimler',
  },
];

const NOTIFICATION_TYPES = [
  {
    id: 'updates',
    title: 'Güncellemeler',
    description: 'Yeni özellikler ve güncellemeler',
  },
  {
    id: 'maintenance',
    title: 'Bakım Bildirimleri',
    description: 'Planlı bakım ve kesintiler',
  },
  {
    id: 'security',
    title: 'Güvenlik Uyarıları',
    description: 'Güvenlikle ilgili bildirimler',
  },
  {
    id: 'news',
    title: 'Haberler',
    description: 'Yeni haberler ve duyurular',
  },
];

export default function NotificationSettings() {
  const [notificationChannels, setNotificationChannels] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
  });

  const [notificationTypes, setNotificationTypes] = useState({
    updates: true,
    maintenance: true,
    security: true,
    news: false,
  });

  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const handleChannelToggle = (channelId) => {
    setNotificationChannels(prev => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const handleTypeToggle = (typeId) => {
    setNotificationTypes(prev => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  const handleSave = () => {
    // Burada bildirim ayarları kaydedilecek
    Alert.alert('Başarılı', 'Bildirim ayarlarınız güncellendi!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirim Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rahatsız Etme</Text>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Rahatsız Etme Modu</Text>
              <Text style={styles.settingDescription}>
                Tüm bildirimleri sessize al
              </Text>
            </View>
            <Switch
              value={doNotDisturb}
              onValueChange={setDoNotDisturb}
              trackColor={{ false: '#767577', true: '#4ECDC4' }}
              thumbColor={doNotDisturb ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Kanalları</Text>
          {NOTIFICATION_SETTINGS.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>
                  {setting.description}
                </Text>
              </View>
              <Switch
                value={notificationChannels[setting.id]}
                onValueChange={() => handleChannelToggle(setting.id)}
                trackColor={{ false: '#767577', true: '#4ECDC4' }}
                thumbColor={notificationChannels[setting.id] ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Türleri</Text>
          {NOTIFICATION_TYPES.map((type) => (
            <View key={type.id} style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>{type.title}</Text>
                <Text style={styles.settingDescription}>
                  {type.description}
                </Text>
              </View>
              <Switch
                value={notificationTypes[type.id]}
                onValueChange={() => handleTypeToggle(type.id)}
                trackColor={{ false: '#767577', true: '#4ECDC4' }}
                thumbColor={notificationTypes[type.id] ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          ))}
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
  settingDescription: {
    color: '#8F9BA8',
    fontSize: 14,
  },
}); 