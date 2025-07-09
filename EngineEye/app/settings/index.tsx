import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

type IconNames = React.ComponentProps<typeof Feather>['name'];

interface MenuItem {
  id: string;
  title: string;
  icon: IconNames;
  route: string;
}

const SETTINGS_MENU: MenuItem[] = [
  {
    id: 'profile',
    title: 'Profil Ayarları',
    icon: 'user',
    route: 'profile',
  },
  {
    id: 'vehicle',
    title: 'Araç Ayarları',
    icon: 'truck',
    route: 'vehicle',
  },
  {
    id: 'language',
    title: 'Dil ve Bölge',
    icon: 'globe',
    route: 'language',
  },
  {
    id: 'theme',
    title: 'Tema Ayarları',
    icon: 'eye',
    route: 'theme',
  },
  {
    id: 'notifications',
    title: 'Bildirim Ayarları',
    icon: 'bell',
    route: 'notifications',
  },
  {
    id: 'password',
    title: 'Parola Değiştir',
    icon: 'lock',
    route: 'password',
  },
];

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {SETTINGS_MENU.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={20} color="#4ECDC4" />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8F9BA8" />
          </TouchableOpacity>
        ))}
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
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#243240',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemTitle: {
    color: '#FFF',
    fontSize: 16,
  },
}); 