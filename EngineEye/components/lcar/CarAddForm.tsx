import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import CarForm from './CarForm';
import { CarDetails, MaintenanceRecord, FuelRecord } from './types';
import { auth, db } from '../../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  orderBy 
} from 'firebase/firestore';

type FilterType = 'all' | 'favorites';

// Icon mapping for status items
const statusIcons = {
  insurance: 'shield' as const,
  inspection: 'check-circle' as const,
  traffic: 'alert-circle' as const
};

// Icon mapping for maintenance items
const maintenanceIcons = {
  oil: 'droplet' as const,
  tire: 'disc' as const,
  brake: 'tool' as const,
  battery: 'battery' as const
};

export default function CarAddForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [editingCar, setEditingCar] = useState<CarDetails | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<CarDetails | null>(null);

  useEffect(() => {
    loadCars();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadCars();
      } else {
        setCars([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadCars = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const carsQuery = query(
        collection(db, 'vehicles'),
        where('userEmail', '==', user.email),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(carsQuery);
      const carsList: CarDetails[] = [];
      querySnapshot.forEach((doc) => {
        carsList.push({ ...doc.data(), id: doc.id } as CarDetails);
      });
      setCars(carsList);
    } catch (error) {
      console.error('Error loading cars:', error);
      Alert.alert('Hata', 'Araçlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (data: CarDetails) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      const carData: CarDetails = {
        ...data,
        userEmail: user.email || '',
        userId: user.uid,
        createdAt: new Date().toISOString(),
        maintenanceHistory: [],
        fuelRecords: [],
        activeIssues: [],
        issueHistory: [],
        performanceMetrics: {
          averageFuelConsumption: 0,
          averageSpeed: 0,
          engineHealth: 100,
          batteryHealth: 100,
          brakesHealth: 100,
          lastUpdated: new Date().toISOString()
        }
      };

      const docRef = await addDoc(collection(db, 'vehicles'), carData);
      const newCar = { ...carData, id: docRef.id };
      setCars(prev => [newCar, ...prev]);
      setModalVisible(false);
      Alert.alert('Başarılı', 'Araç başarıyla eklendi.');
    } catch (error) {
      console.error('Error adding car:', error);
      Alert.alert('Hata', 'Araç eklenirken bir hata oluştu.');
    }
  };

  const handleEditCar = async (data: CarDetails) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Hata', 'Lütfen önce giriş yapın.');
        return;
      }

      const carRef = doc(db, 'vehicles', data.id);
      await updateDoc(carRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setCars(prev => prev.map(car => car.id === data.id ? { ...data } : car));
      setEditingCar(null);
      setModalVisible(false);
      Alert.alert('Başarılı', 'Araç bilgileri güncellendi.');
    } catch (error) {
      console.error('Error updating car:', error);
      Alert.alert('Hata', 'Araç güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteCar = async (id: string) => {
    Alert.alert(
      "Aracı Sil",
      "Bu aracı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'vehicles', id));
              setCars(prev => prev.filter(car => car.id !== id));
              Alert.alert('Başarılı', 'Araç başarıyla silindi.');
            } catch (error) {
              console.error('Error deleting car:', error);
              Alert.alert('Hata', 'Araç silinirken bir hata oluştu.');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const startEditing = (car: CarDetails) => {
    setEditingCar(car);
    setModalVisible(true);
  };

  const filteredCars = activeFilter === 'favorites' 
    ? cars.filter(car => car.isFavorite)
    : cars;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'favorites' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('favorites')}
          >
            <Feather 
              name="star" 
              size={16} 
              color={activeFilter === 'favorites' ? "#FFD700" : "#666"} 
            />
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'favorites' && styles.filterButtonTextActive
            ]}>
              Favori Araçlar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Feather 
              name="list" 
              size={16} 
              color={activeFilter === 'all' ? "#4ECDC4" : "#666"} 
            />
            <Text style={[
              styles.filterButtonText,
              activeFilter === 'all' && styles.filterButtonTextActive
            ]}>
              Tüm Araçlar
            </Text>
          </TouchableOpacity>
        </View>

        {filteredCars.map(car => (
          <TouchableOpacity key={car.id} onPress={() => setSelectedCar(car)}>
            <View style={styles.carItem}>
              <View style={styles.carInfo}>
                <View style={styles.carTitleContainer}>
                  <Text style={styles.carTitle}>{car.brand} {car.model}</Text>
                  {car.isFavorite && (
                    <Feather name="star" size={16} color="#FFD700" style={styles.favoriteIcon} />
                  )}
                </View>
                <Text style={styles.carPlate}>{car.plateNumber}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => startEditing(car)}
                >
                  <Feather name="edit-2" size={20} color="#4ECDC4" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteCar(car.id)}
                >
                  <Feather name="trash-2" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setEditingCar(null);
          setModalVisible(true);
        }}
      >
        <Feather name="plus" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Yeni Araç Ekle</Text>
      </TouchableOpacity>

      {/* Araç Formu Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingCar(null);
        }}
      >
        <View style={styles.modalContainer}>
          <CarForm
            onSubmit={handleAddCar}
            onEdit={handleEditCar}
            onClose={() => {
              setModalVisible(false);
              setEditingCar(null);
            }}
            initialData={editingCar || undefined}
            isEditing={!!editingCar}
          />
        </View>
      </Modal>

      {/* Araç Ön İzleme Modalı */}
      {selectedCar && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedCar !== null}
          onRequestClose={() => setSelectedCar(null)}
        >
          <View style={styles.previewModalContainer}>
            <ScrollView style={styles.previewModalContent}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>
                  {selectedCar.brand} {selectedCar.model}
                </Text>
                {selectedCar.isFavorite && (
                  <Feather name="star" size={20} color="#FFD700" />
                )}
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Araç Bilgileri</Text>
                <View style={styles.previewRow}>
                  <Feather name="hash" size={18} color="#4ECDC4" />
                  <Text style={styles.previewText}>Plaka: {selectedCar.plateNumber}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Feather name="calendar" size={18} color="#4ECDC4" />
                  <Text style={styles.previewText}>Model Yılı: {selectedCar.year}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Feather name="activity" size={18} color="#4ECDC4" />
                  <Text style={styles.previewText}>Kilometre: {selectedCar.mileage} km</Text>
                </View>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Yakıt ve Vites</Text>
                <View style={styles.previewRow}>
                  <Feather name="droplet" size={18} color="#4ECDC4" />
                  <Text style={styles.previewText}>Yakıt Tipi: {selectedCar.fuelType}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Feather name="settings" size={18} color="#4ECDC4" />
                  <Text style={styles.previewText}>Vites: {selectedCar.transmission}</Text>
                </View>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Önemli Tarihler</Text>
                {[
                  { 
                    icon: statusIcons.insurance,
                    title: 'Kasko',
                    date: selectedCar.insuranceDate,
                    days: getDaysUntil(selectedCar.insuranceDate)
                  },
                  {
                    icon: statusIcons.inspection,
                    title: 'Muayene',
                    date: selectedCar.inspectionDate,
                    days: getDaysUntil(selectedCar.inspectionDate)
                  },
                  {
                    icon: statusIcons.traffic,
                    title: 'Trafik Sigortası',
                    date: selectedCar.trafficInsuranceDate,
                    days: getDaysUntil(selectedCar.trafficInsuranceDate)
                  }
                ].map((item, index) => (
                  <View key={index} style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                      <Feather name={item.icon} size={18} color={getStatusColor(item.days)} />
                      <Text style={styles.statusTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.statusInfo}>
                      <Text style={[styles.statusDate, { color: getStatusColor(item.days) }]}>
                        {formatDate(item.date)}
                      </Text>
                      <Text style={[styles.statusDays, { color: getStatusColor(item.days) }]}>
                        {getStatusText(item.days)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Son Bakımlar</Text>
                {[
                  {
                    icon: maintenanceIcons.oil,
                    title: 'Yağ Değişimi',
                    date: selectedCar.lastOilChange?.date,
                    mileage: selectedCar.lastOilChange?.mileage
                  },
                  {
                    icon: maintenanceIcons.tire,
                    title: 'Lastik Değişimi',
                    date: selectedCar.lastTireChange?.date,
                    mileage: selectedCar.lastTireChange?.mileage
                  },
                  {
                    icon: maintenanceIcons.brake,
                    title: 'Fren Bakımı',
                    date: selectedCar.lastBrakeService?.date,
                    mileage: selectedCar.lastBrakeService?.mileage
                  },
                  {
                    icon: maintenanceIcons.battery,
                    title: 'Akü Değişimi',
                    date: selectedCar.lastBatteryChange,
                  }
                ].map((item, index) => (
                  <View key={index} style={styles.maintenanceCard}>
                    <View style={styles.maintenanceHeader}>
                      <Feather 
                        name={item.icon} 
                        size={18} 
                        color={isMaintenanceNeeded(item.date) ? '#FF6B6B' : '#4ECDC4'} 
                      />
                      <Text style={styles.maintenanceTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.maintenanceInfo}>
                      <Text style={styles.maintenanceDate}>
                        {formatDate(item.date)}
                      </Text>
                      {item.mileage && (
                        <Text style={styles.maintenanceMileage}>
                          {item.mileage} km'de yapıldı
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Bakım Geçmişi */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Bakım Geçmişi</Text>
                {selectedCar.maintenanceHistory?.map((record, index) => (
                  <View key={index} style={styles.maintenanceHistoryCard}>
                    <View style={styles.maintenanceHistoryHeader}>
                      <Text style={styles.maintenanceHistoryType}>{record.type}</Text>
                      <Text style={[
                        styles.maintenanceHistoryStatus,
                        { color: getMaintenanceStatus(record) === 'overdue' ? '#FF6B6B' : 
                               getMaintenanceStatus(record) === 'upcoming' ? '#FFD700' : '#4ECDC4' }
                      ]}>
                        {getMaintenanceStatus(record) === 'overdue' ? 'Gecikmiş' :
                         getMaintenanceStatus(record) === 'upcoming' ? 'Yaklaşıyor' : 'Zamanında'}
                      </Text>
                    </View>
                    <Text style={styles.maintenanceHistoryDate}>
                      Tarih: {formatDate(record.date)}
                    </Text>
                    <Text style={styles.maintenanceHistoryMileage}>
                      Kilometre: {record.mileage}
                    </Text>
                    <Text style={styles.maintenanceHistoryDescription}>
                      {record.description}
                    </Text>
                    {record.nextDueDate && (
                      <Text style={styles.maintenanceHistoryNext}>
                        Sonraki Bakım: {formatDate(record.nextDueDate)}
                      </Text>
                    )}
                    <Text style={styles.maintenanceHistoryCost}>
                      Maliyet: {record.cost.toLocaleString('tr-TR')} ₺
                    </Text>
                  </View>
                ))}
              </View>

              {/* Yakıt Tüketimi */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Yakıt Tüketimi</Text>
                {selectedCar.fuelRecords?.length > 0 ? (
                  <>
                    <View style={styles.fuelStatsContainer}>
                      <View style={styles.fuelStat}>
                        <Text style={styles.fuelStatLabel}>Ortalama Tüketim</Text>
                        <Text style={styles.fuelStatValue}>
                          {calculateAverageConsumption(selectedCar.fuelRecords)?.toFixed(1) || '-'} Lt/100km
                        </Text>
                      </View>
                      <View style={styles.fuelStat}>
                        <Text style={styles.fuelStatLabel}>Son Dolum</Text>
                        <Text style={styles.fuelStatValue}>
                          {selectedCar.fuelRecords[0].liters.toFixed(1)} Lt
                        </Text>
                      </View>
                    </View>
                    {selectedCar.fuelRecords.slice(0, 5).map((record, index) => (
                      <View key={index} style={styles.fuelRecordCard}>
                        <View style={styles.fuelRecordHeader}>
                          <Text style={styles.fuelRecordDate}>{formatDate(record.date)}</Text>
                          <Text style={styles.fuelRecordCost}>{record.cost.toLocaleString('tr-TR')} ₺</Text>
                        </View>
                        <View style={styles.fuelRecordDetails}>
                          <Text style={styles.fuelRecordLiters}>{record.liters.toFixed(1)} Lt</Text>
                          <Text style={styles.fuelRecordMileage}>{record.mileage} km</Text>
                          {record.averageConsumption && (
                            <Text style={styles.fuelRecordConsumption}>
                              {record.averageConsumption.toFixed(1)} Lt/100km
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noDataText}>Henüz yakıt kaydı girilmemiş</Text>
                )}
              </View>

              {/* Aktif Sorunlar */}
              <View style={styles.previewSection}>
                <Text style={styles.previewSectionTitle}>Aktif Sorunlar</Text>
                {selectedCar.activeIssues?.length > 0 ? (
                  selectedCar.activeIssues.map((issue, index) => (
                    <View key={index} style={styles.issueCard}>
                      <View style={styles.issueHeader}>
                        <Text style={styles.issueTitle}>{issue.title}</Text>
                        <View style={[
                          styles.issuePriority,
                          { backgroundColor: issue.priority === 'high' ? '#FF6B6B' :
                                                  issue.priority === 'medium' ? '#FFD700' : '#4ECDC4' }
                        ]}>
                          <Text style={styles.issuePriorityText}>
                            {issue.priority === 'high' ? 'Yüksek' :
                             issue.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.issueDescription}>{issue.description}</Text>
                      <View style={styles.issueSymptoms}>
                        {issue.symptoms.map((symptom, sIndex) => (
                          <View key={sIndex} style={styles.symptomTag}>
                            <Text style={styles.symptomText}>{symptom}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.issueFooter}>
                        <Text style={styles.issueDate}>{formatDate(issue.date)}</Text>
                        <Text style={[
                          styles.issueStatus,
                          { color: getIssueStatusColor(issue.status) }
                        ]}>
                          {issue.status === 'open' ? 'Açık' :
                           issue.status === 'resolved' ? 'Çözüldü' : 'İzleniyor'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>Aktif sorun bulunmuyor</Text>
                )}
              </View>

              {/* Performans Metrikleri */}
              {selectedCar.performanceMetrics && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Performans Durumu</Text>
                  <View style={styles.performanceGrid}>
                    <View style={styles.performanceCard}>
                      <Text style={styles.performanceLabel}>Motor Sağlığı</Text>
                      <View style={styles.performanceBar}>
                        <View style={[
                          styles.performanceFill,
                          { 
                            width: `${selectedCar.performanceMetrics.engineHealth}%`,
                            backgroundColor: selectedCar.performanceMetrics.engineHealth > 70 ? '#4ECDC4' :
                                                   selectedCar.performanceMetrics.engineHealth > 40 ? '#FFD700' : '#FF6B6B'
                          }
                        ]} />
                      </View>
                      <Text style={styles.performanceValue}>
                        {selectedCar.performanceMetrics.engineHealth}%
                      </Text>
                    </View>

                    <View style={styles.performanceCard}>
                      <Text style={styles.performanceLabel}>Akü Durumu</Text>
                      <View style={styles.performanceBar}>
                        <View style={[
                          styles.performanceFill,
                          { 
                            width: `${selectedCar.performanceMetrics.batteryHealth}%`,
                            backgroundColor: selectedCar.performanceMetrics.batteryHealth > 70 ? '#4ECDC4' :
                                                   selectedCar.performanceMetrics.batteryHealth > 40 ? '#FFD700' : '#FF6B6B'
                          }
                        ]} />
                      </View>
                      <Text style={styles.performanceValue}>
                        {selectedCar.performanceMetrics.batteryHealth}%
                      </Text>
                    </View>

                    <View style={styles.performanceCard}>
                      <Text style={styles.performanceLabel}>Fren Sistemi</Text>
                      <View style={styles.performanceBar}>
                        <View style={[
                          styles.performanceFill,
                          { 
                            width: `${selectedCar.performanceMetrics.brakesHealth}%`,
                            backgroundColor: selectedCar.performanceMetrics.brakesHealth > 70 ? '#4ECDC4' :
                                                   selectedCar.performanceMetrics.brakesHealth > 40 ? '#FFD700' : '#FF6B6B'
                          }
                        ]} />
                      </View>
                      <Text style={styles.performanceValue}>
                        {selectedCar.performanceMetrics.brakesHealth}%
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedCar(null)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Tarih formatlama ve kontrol fonksiyonları
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Belirtilmemiş';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
};

const isExpired = (dateString?: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date < new Date();
};

const isMaintenanceNeeded = (dateString?: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return date < sixMonthsAgo;
};

const getDaysUntil = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusColor = (days: number | null) => {
  if (days === null) return '#666';
  if (days < 0) return '#FF6B6B'; // Kırmızı - Süresi geçmiş
  if (days < 30) return '#FFD700'; // Sarı - Yaklaşıyor
  return '#4ECDC4'; // Yeşil - İyi durumda
};

const getStatusText = (days: number | null) => {
  if (days === null) return 'Belirtilmemiş';
  if (days < 0) return `${Math.abs(days)} gün geçti`;
  return `${days} gün kaldı`;
};

// Yeni yardımcı fonksiyonlar
const calculateAverageConsumption = (fuelRecords: FuelRecord[]) => {
  if (fuelRecords.length < 2) return null;
  const totalLiters = fuelRecords.reduce((sum, record) => sum + record.liters, 0);
  const firstMileage = parseInt(fuelRecords[0].mileage);
  const lastMileage = parseInt(fuelRecords[fuelRecords.length - 1].mileage);
  const distance = lastMileage - firstMileage;
  return (totalLiters / distance) * 100; // lt/100km
};

const getMaintenanceStatus = (record: MaintenanceRecord) => {
  if (!record.nextDueDate && !record.nextDueMileage) return 'unknown';
  const today = new Date();
  const nextDate = record.nextDueDate ? new Date(record.nextDueDate) : null;
  if (nextDate && nextDate < today) return 'overdue';
  if (nextDate && nextDate.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000) return 'upcoming';
  return 'ok';
};

const getIssueStatusColor = (status: string) => {
  switch (status) {
    case 'open': return '#FF6B6B';
    case 'resolved': return '#4ECDC4';
    case 'monitoring': return '#FFD700';
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 80,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1a252f',
    borderRadius: 10,
    padding: 5,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#243240',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
  filterButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  carInfo: {
    flex: 1,
  },
  carTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  carPlate: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#243240',
  },
  deleteButton: {
    backgroundColor: '#331F27',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  previewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  previewModalContent: {
    backgroundColor: '#1a252f',
    borderRadius: 15,
    padding: 20,
    maxHeight: '90%',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#243240',
    paddingBottom: 10,
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  previewSection: {
    marginBottom: 20,
    backgroundColor: '#243240',
    padding: 15,
    borderRadius: 10,
  },
  previewSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4ECDC4',
    marginBottom: 10,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },
  statusCard: {
    backgroundColor: '#243240',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  statusInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDate: {
    fontSize: 14,
  },
  statusDays: {
    fontSize: 14,
    fontWeight: '500',
  },
  maintenanceCard: {
    backgroundColor: '#243240',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceTitle: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  maintenanceInfo: {
    marginLeft: 28,
  },
  maintenanceDate: {
    color: '#FFF',
    fontSize: 14,
  },
  maintenanceMileage: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  maintenanceHistoryCard: {
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  maintenanceHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  maintenanceHistoryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  maintenanceHistoryStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  maintenanceHistoryDate: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  maintenanceHistoryMileage: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  maintenanceHistoryDescription: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },
  maintenanceHistoryNext: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 5,
  },
  maintenanceHistoryCost: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '500',
  },
  fuelStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  fuelStat: {
    flex: 1,
    alignItems: 'center',
  },
  fuelStatLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  fuelStatValue: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '600',
  },
  fuelRecordCard: {
    backgroundColor: '#1a252f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fuelRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fuelRecordDate: {
    color: '#999',
    fontSize: 14,
  },
  fuelRecordCost: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '500',
  },
  fuelRecordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fuelRecordLiters: {
    color: '#FFF',
    fontSize: 14,
  },
  fuelRecordMileage: {
    color: '#FFF',
    fontSize: 14,
  },
  fuelRecordConsumption: {
    color: '#FFD700',
    fontSize: 14,
  },
  issueCard: {
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  issueTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  issuePriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  issuePriorityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  issueDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
  },
  issueSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  symptomTag: {
    backgroundColor: '#243240',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  symptomText: {
    color: '#FFF',
    fontSize: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueDate: {
    color: '#999',
    fontSize: 12,
  },
  issueStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  performanceGrid: {
    marginTop: 10,
  },
  performanceCard: {
    backgroundColor: '#1a252f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  performanceLabel: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  performanceBar: {
    height: 6,
    backgroundColor: '#243240',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  performanceValue: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom:30,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
