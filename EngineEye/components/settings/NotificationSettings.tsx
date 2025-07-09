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

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'serviceReminders',
    title: 'Servis Hatırlatmaları',
    description: 'Araç bakım ve servis zamanı geldiğinde bildirim al',
    icon: 'tool',
  },
  {
    id: 'fuelAlerts',
    title: 'Yakıt Uyarıları',
    description: 'Yakıt seviyesi düştüğünde bildirim al',
    icon: 'droplet',
  },
  {
    id: 'updates',
    title: 'Uygulama Güncellemeleri',
    description: 'Yeni özellikler ve güncellemeler hakkında bilgi al',
    icon: 'refresh-cw',
  },
  {
    id: 'news',
    title: 'Haberler ve Duyurular',
    description: 'Önemli haberler ve duyurulardan haberdar ol',
    icon: 'bell',
  },
  {
    id: 'promotions',
    title: 'Kampanyalar',
    description: 'Özel teklifler ve kampanyalardan haberdar ol',
    icon: 'tag',
  },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    serviceReminders: true,
    fuelAlerts: true,
    updates: true,
    news: false,
    promotions: false,
  });
  const [masterSwitch, setMasterSwitch] = useState(true);

  const handleToggleSetting = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleMaster = () => {
    const newValue = !masterSwitch;
    setMasterSwitch(newValue);
    
    // Tüm bildirimleri aç/kapat
    const newSettings = Object.keys(settings).reduce((acc, key) => ({
      ...acc,
      [key]: newValue,
    }), {});
    setSettings(newSettings);
  };

  const handleSave = () => {
    // Bildirim ayarlarını kaydet
    Alert.alert('Başarılı', 'Bildirim ayarlarınız güncellendi!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirim Ayarları</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.masterSwitchContainer}>
          <View style={styles.masterSwitchContent}>
            <Feather name="bell" size={24} color="#FFF" />
            <View style={styles.masterSwitchText}>
              <Text style={styles.masterSwitchTitle}>Tüm Bildirimler</Text>
              <Text style={styles.masterSwitchDescription}>
                Tüm bildirimleri aç/kapat
              </Text>
            </View>
          </View>
          <Switch
            value={masterSwitch}
            onValueChange={handleToggleMaster}
            trackColor={{ false: '#1a252f', true: '#4ECDC4' }}
            thumbColor={masterSwitch ? '#FFF' : '#666'}
          />
        </View>

        <View style={styles.settingsContainer}>
          {NOTIFICATION_SETTINGS.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { opacity: settings[setting.id] ? 1 : 0.5 }]}>
                  <Feather name={setting.icon} size={20} color="#FFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { opacity: settings[setting.id] ? 1 : 0.5 }]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, { opacity: settings[setting.id] ? 0.8 : 0.3 }]}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings[setting.id]}
                onValueChange={() => handleToggleSetting(setting.id)}
                trackColor={{ false: '#1a252f', true: '#4ECDC4' }}
                thumbColor={settings[setting.id] ? '#FFF' : '#666'}
                disabled={!masterSwitch}
              />
            </View>
          ))}
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
  masterSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  masterSwitchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  masterSwitchText: {
    marginLeft: 15,
  },
  masterSwitchTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  masterSwitchDescription: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  settingsContainer: {
    marginTop: 10,
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
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    color: '#666',
    fontSize: 14,
  },
}); 