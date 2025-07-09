import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface City {
  latitude: number;
  longitude: number;
}

interface Cities {
  [key: string]: City;
}

const WeatherComponent = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>('İstanbul');

  const cities: Cities = {
    'İstanbul': { latitude: 41.0082, longitude: 28.9784 },
    'İzmir': { latitude: 38.4237, longitude: 27.1428 },
    'Antalya': { latitude: 36.8969, longitude: 30.7133 },
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedCity]);

  const fetchWeatherData = async () => {
    try {
      const cityData = cities[selectedCity];
      if (!cityData) {
        throw new Error('Şehir koordinatları bulunamadı');
      }

      const { latitude, longitude } = cityData;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      
      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }

      const data = await response.json();
      setWeather(data.current_weather);
      setLoading(false);
    } catch (error) {
      console.error('Hata:', error);
      setLoading(false);
      Alert.alert('Hata', 'Hava durumu verileri alınamadı.');
    }
  };

  const getWeatherIcon = (temperature: number) => {
    if (temperature > 25) return 'sun';
    if (temperature > 15) return 'cloud';
    return 'cloud-rain';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.locationInfo}>
            <Feather name="map-pin" size={20} color="#4ECDC4" />
            <Text style={styles.city}>{selectedCity}</Text>
          </View>
          <TouchableOpacity onPress={fetchWeatherData}>
            <Feather name="refresh-cw" size={20} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.weatherInfo}>
          <View style={styles.temperatureContainer}>
            <Feather 
              name={getWeatherIcon(weather.temperature)} 
              size={48} 
              color="#4ECDC4" 
              style={styles.weatherIcon}
            />
            <Text style={styles.temperature}>{weather.temperature}°</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Feather name="wind" size={20} color="#4ECDC4" />
              <Text style={styles.detailText}>
                {weather.windspeed} km/s
              </Text>
            </View>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityButtonsContainer}
        >
          {Object.keys(cities).map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.cityButton,
                selectedCity === city && styles.selectedCityButton
              ]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={[
                styles.cityButtonText,
                selectedCity === city && styles.selectedCityButtonText
              ]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a252f',
    borderRadius: 20,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  container: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
  },
  card: {
    backgroundColor: '#1a252f',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    marginRight: 10,
  },
  temperature: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243240',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  detailText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  cityButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#243240',
    marginHorizontal: 5,
  },
  selectedCityButton: {
    backgroundColor: '#4ECDC4',
  },
  cityButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCityButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default WeatherComponent;
