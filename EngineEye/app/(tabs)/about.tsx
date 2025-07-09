import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth, logoutUser, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface MenuItem {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  route?: string;
  onPress?: () => void;
}

export default function AboutScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.username || 'Kullanıcı');
          }
          setUserEmail(user.email || '');
        } catch (error) {
          console.error('Error loading user data:', error);
          setUserName('Kullanıcı');
        }
      }
    };
    
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          onPress: async () => {
            const { error } = await logoutUser();
            if (!error) {
              router.replace('/auth');
            } else {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { 
      title: "Profil Ayarları",
      icon: "user",
      color: "#FF6B6B",
      route: "/settings/profile"
    },
    { 
      title: "Bildirim Ayarları",
      icon: "bell",
      color: "#45B7D1",
      route: "/settings/notifications"
    },
    { 
      title: "Gizlilik Ayarları",
      icon: "lock",
      color: "#96CEB4",
      route: "/settings/privacy"
    },
    { 
      title: "Şifre Güncelle",
      icon: "key",
      color: "#FFEEAD",
      route: "/settings/password"
    },
    { 
      title: "Tema Ayarları",
      icon: "sun",
      color: "#D4A5A5",
      route: "/settings/theme"
    },
    { 
      title: "Dil ve Bölge",
      icon: "globe",
      color: "#9B5DE5",
      route: "/settings/language"
    },
    { 
      title: "Yardım ve Destek",
      icon: "help-circle",
      color: "#FF9A8B",
      route: "/settings/help"
    },
    { 
      title: "Hesap Silme",
      icon: "trash-2",
      color: "#FF0000",
      route: "/settings/delete-account"
    },
    { 
      title: "Çıkış Yap",
      icon: "log-out",
      color: "#FF6B6B",
      onPress: handleLogout
    },
  ];

  const handlePress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Feather name="user" size={50} color="#FFF" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.title === "Çıkış Yap" && styles.logoutButton,
              item.title === "Hesap Silme" && styles.deleteAccountButton
            ]}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Feather name={item.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[
                styles.menuItemTitle,
                item.title === "Çıkış Yap" && styles.logoutText,
                item.title === "Hesap Silme" && styles.deleteAccountText
              ]}>
                {item.title}
              </Text>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Versiyon 1.0.0</Text>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a252f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1a252f',
    borderRadius: 12,
    padding: 15,
  },
  logoutButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  deleteAccountButton: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  deleteAccountText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    color: '#666',
    fontSize: 14,
  },
});
