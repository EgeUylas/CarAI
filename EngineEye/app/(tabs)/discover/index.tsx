import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Text,
  TextInput,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, Link, useRouter } from 'expo-router';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const sections = [
    {
      id: 'events',
      title: 'Etkinlikler',
      subtitle: 'Yaklaşan buluşmalar',
      icon: 'calendar',
      color: '#4ECDC4',
      image: require('@/assets/images/araba2.jpg'),
      onPress: () => router.push('/(tabs)/discover/events'),
    },
    {
      id: 'videos',
      title: 'Videolar',
      subtitle: 'En yeni modifiye videoları',
      icon: 'play-circle',
      color: '#FF6B6B',
      image: require('@/assets/images/araba1.jpg'),
      onPress: () => router.push('/(tabs)/discover/videos'),
    },
    {
      id: 'clubs',
      title: 'Kulüpler',
      subtitle: 'Topluluklara katıl',
      icon: 'users',
      color: '#2C3E50',
      image: require('@/assets/images/araba3.jpg'),
      onPress: () => router.push('/(tabs)/discover/clubs'),
    },
    {
      id: 'marketplace',
      title: 'Pazar Yeri',
      subtitle: 'Alım satım ilanları',
      icon: 'shopping-bag',
      color: '#96CEB4',
      image: require('@/assets/images/araba4.jpg'),
      onPress: () => router.push('/(tabs)/discover/marketplace'),
    },
    {
      id: 'emergency',
      title: 'Acil Yardım',
      subtitle: 'Yol yardım ve acil durumlar',
      icon: 'alert-circle',
      color: '#E74C3C',
      image: require('@/assets/images/araba5.jpg'),
      onPress: () => router.push('/(tabs)/discover/emergency'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Keşfet</Text>
      </View>

      {/* Featured Section - New Forum Card */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Öne Çıkanlar</Text>
        <TouchableOpacity 
          style={[styles.featuredCard, { backgroundColor: '#1a3a50' }]}
          onPress={() => router.push('/discover/forum')}
        >
          <View style={styles.cardContent}>
            <Feather name="message-square" size={40} color="#4ECDC4" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Araç Forumu</Text>
              <Text style={styles.cardDescription}>
                Sorunlarınızı paylaşın, diğer araç sahipleriyle iletişime geçin ve çözümler bulun.
              </Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Canlı</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#4ECDC4" />
          <TextInput
            style={styles.searchInput}
            placeholder="Ne aramak istersin?"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Trend Başlığı */}
      <View style={styles.sectionHeader}>
        <Feather name="trending-up" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Trend İçerikler</Text>
      </View>

      {/* Bölümler */}
      {sections.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={styles.sectionCard}
          onPress={section.onPress}
        >
          <Image source={section.image} style={styles.sectionImage} />
          <View style={[styles.sectionOverlay, { backgroundColor: section.color + '99' }]} />
          <View style={styles.sectionContent}>
            <View style={styles.sectionIcon}>
              <Feather name={section.icon as any} size={24} color="#FFF" />
            </View>
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
      ))}

      {/* Önerilen İçerikler */}
      <View style={styles.sectionHeader}>
        <Feather name="star" size={20} color="#4ECDC4" />
        <Text style={styles.sectionTitle}>Önerilen İçerikler</Text>
      </View>

      {/* Yakında gelecek önerilen içerikler için yer tutucu */}
      <View style={styles.comingSoon}>
        <Feather name="coffee" size={24} color="#4ECDC4" />
        <Text style={styles.comingSoonText}>Yakında yeni özellikler geliyor!</Text>
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
    padding: 16,
    backgroundColor: '#1a252f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  featuredSection: {
    padding: 16,
    backgroundColor: '#1a252f',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  featuredCard: {
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ECDC4',
    marginRight: 4,
  },
  liveText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a252f',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243240',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFF',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 180,
  },
  sectionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sectionContent: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  comingSoon: {
    margin: 16,
    padding: 20,
    backgroundColor: '#1a252f',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    marginTop: 8,
    color: '#4ECDC4',
    fontSize: 14,
  },
}); 