export interface MaintenanceRecord {
  date: string;
  mileage: string;
  type: string;
  description: string;
  cost: number;
  partReplaced?: string;
  partLifeExpectancy?: number; // ay cinsinden
  nextDueDate?: string;
  nextDueMileage?: string;
  performedBy: string;
  receiptPhoto?: string;
}

export interface FuelRecord {
  date: string;
  mileage: string;
  liters: number;
  cost: number;
  fuelType: string;
  fullTank: boolean;
  station?: string;
  averageConsumption?: number; // lt/100km
}

export interface IssueRecord {
  date: string;
  mileage: string;
  title: string;
  description: string;
  symptoms: string[];
  status: 'open' | 'resolved' | 'monitoring';
  resolution?: string;
  cost?: number;
  relatedParts?: string[];
  priority: 'low' | 'medium' | 'high';
  category: 'mechanical' | 'electrical' | 'body' | 'interior' | 'other';
}

export interface PerformanceMetrics {
  averageFuelConsumption: number;
  averageSpeed: number;
  engineHealth: number; // 0-100 arası puan
  batteryHealth: number; // 0-100 arası puan
  brakesHealth: number; // 0-100 arası puan
  lastUpdated: string;
}

export interface CarDetails {
  id: string;
  // Temel Bilgiler
  brand: string;
  model: string;
  year: string;
  mileage: string;
  plateNumber: string;
  isFavorite: boolean; // Favori araç özelliği

  // Yasal Bilgiler
  insuranceDate: string;    // Sigorta bitiş tarihi
  inspectionDate: string;   // Muayene bitiş tarihi
  trafficInsuranceDate: string; // Trafik sigortası bitiş tarihi

  // Bakım Geçmişi
  maintenanceHistory: MaintenanceRecord[];
  lastOilChange: {
    date: string;
    mileage: string;
  };
  lastTireChange: {
    date: string;
    mileage: string;
  };
  lastBrakeService: {
    date: string;
    mileage: string;
  };
  lastBatteryChange: string;
  lastFilterChange: string;

  // Yakıt ve Performans
  fuelRecords: FuelRecord[];
  performanceMetrics: PerformanceMetrics;

  // Arıza ve Sorun Takibi
  issueHistory: IssueRecord[];
  activeIssues: IssueRecord[];

  // Diğer Önemli Bilgiler
  fuelType: 'benzin' | 'dizel' | 'lpg' | 'elektrik' | 'hibrit';
  transmission: 'manuel' | 'otomatik';
  engineSize?: string;
  enginePower?: string;
  vin?: string; // Şasi numarası
  color?: string;
  purchaseDate?: string;
  purchaseMileage?: string;
  purchasePrice?: number;
  estimatedValue?: number;
  
  // Sistem Bilgileri
  createdAt: string;
  updatedAt: string;
  userEmail: string;
  userId: string;
} 