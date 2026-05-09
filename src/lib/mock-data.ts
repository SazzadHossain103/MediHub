// Mock data store for admin system
// This simulates a backend database with localStorage persistence

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  registeredAt: string
}

export interface Hospital {
  id: string
  name: string
  email: string
  licenseNumber: string
  address: string
  phone: string
  location?: { lat: number; lng: number }
  status: "pending" | "approved"
  registeredAt: string
}

// Demo patients data
const defaultPatients: Patient[] = [
  {
    id: "patient-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1711-123456",
    registeredAt: "2024-01-10",
  },
  {
    id: "patient-2",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+880 1812-234567",
    registeredAt: "2024-01-12",
  },
  {
    id: "patient-3",
    name: "Rahim Khan",
    email: "rahim.khan@example.com",
    phone: "+880 1913-345678",
    registeredAt: "2024-01-15",
  },
  {
    id: "patient-4",
    name: "Fatima Begum",
    email: "fatima.begum@example.com",
    phone: "+880 1614-456789",
    registeredAt: "2024-01-18",
  },
  {
    id: "patient-5",
    name: "Mohammad Ali",
    email: "mohammad.ali@example.com",
    phone: "+880 1515-567890",
    registeredAt: "2024-01-20",
  },
]

// Demo hospitals data
const defaultHospitals: Hospital[] = [
  {
    id: "hospital-1",
    name: "Dhaka Medical College Hospital",
    email: "info@dmch.gov.bd",
    licenseNumber: "DMCH-2024-001",
    address: "Secretariat Road, Dhaka 1000",
    phone: "+880 2-55165001",
    location: { lat: 23.7260, lng: 90.3980 },
    status: "approved",
    registeredAt: "2024-01-05",
  },
  {
    id: "hospital-2",
    name: "Square Hospital",
    email: "info@squarehospital.com",
    licenseNumber: "SQH-2024-002",
    address: "18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205",
    phone: "+880 2-8159457",
    location: { lat: 23.7528, lng: 90.3761 },
    status: "approved",
    registeredAt: "2024-01-08",
  },
  {
    id: "hospital-3",
    name: "United Hospital",
    email: "info@uhlbd.com",
    licenseNumber: "UHL-2024-003",
    address: "Plot 15, Road 71, Gulshan, Dhaka 1212",
    phone: "+880 2-8836000",
    location: { lat: 23.7937, lng: 90.4147 },
    status: "approved",
    registeredAt: "2024-01-10",
  },
  {
    id: "hospital-4",
    name: "Evercare Hospital",
    email: "info@evercarebd.com",
    licenseNumber: "EVH-2024-004",
    address: "Plot 81, Block E, Bashundhara R/A, Dhaka",
    phone: "+880 2-8432000",
    location: { lat: 23.8194, lng: 90.4322 },
    status: "pending",
    registeredAt: "2024-01-22",
  },
  {
    id: "hospital-5",
    name: "Popular Diagnostic Centre",
    email: "info@populardiagnostic.com",
    licenseNumber: "PDC-2024-005",
    address: "House 16, Road 2, Dhanmondi, Dhaka",
    phone: "+880 2-9116522",
    location: { lat: 23.7461, lng: 90.3742 },
    status: "pending",
    registeredAt: "2024-01-25",
  },
]

// Storage keys
const PATIENTS_KEY = "medihub_patients"
const HOSPITALS_KEY = "medihub_hospitals"
const LOGGED_IN_HOSPITAL_KEY = "medihub_logged_in_hospital"

// Helper to check if we're in browser
const isBrowser = typeof window !== "undefined"

// Initialize data from localStorage or use defaults
function getStoredData<T>(key: string, defaultData: T[]): T[] {
  if (!isBrowser) return defaultData
  
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // If parsing fails, use defaults
  }
  
  // Initialize with defaults
  localStorage.setItem(key, JSON.stringify(defaultData))
  return defaultData
}

// Patient functions
export function getPatients(): Patient[] {
  return getStoredData(PATIENTS_KEY, defaultPatients)
}

export function deletePatient(patientId: string): void {
  if (!isBrowser) return
  
  const patients = getPatients().filter((p) => p.id !== patientId)
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
}

// Hospital functions
export function getHospitals(): Hospital[] {
  return getStoredData(HOSPITALS_KEY, defaultHospitals)
}

export function getHospitalById(hospitalId: string): Hospital | undefined {
  return getHospitals().find((h) => h.id === hospitalId)
}

export function deleteHospital(hospitalId: string): void {
  if (!isBrowser) return
  
  const hospitals = getHospitals().filter((h) => h.id !== hospitalId)
  localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals))
}

export function updateHospitalStatus(hospitalId: string, status: "pending" | "approved"): void {
  if (!isBrowser) return
  
  const hospitals = getHospitals().map((h) =>
    h.id === hospitalId ? { ...h, status } : h
  )
  localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals))
}

export function registerHospital(hospital: Omit<Hospital, "id" | "status" | "registeredAt">): Hospital {
  const newHospital: Hospital = {
    ...hospital,
    id: `hospital-${Date.now()}`,
    status: "pending",
    registeredAt: new Date().toISOString().split("T")[0],
  }
  
  if (isBrowser) {
    const hospitals = getHospitals()
    hospitals.push(newHospital)
    localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals))
  }
  
  return newHospital
}

// Logged in hospital session
export function setLoggedInHospital(hospitalId: string): void {
  if (!isBrowser) return
  localStorage.setItem(LOGGED_IN_HOSPITAL_KEY, hospitalId)
}

export function getLoggedInHospital(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(LOGGED_IN_HOSPITAL_KEY)
}

export function clearLoggedInHospital(): void {
  if (!isBrowser) return
  localStorage.removeItem(LOGGED_IN_HOSPITAL_KEY)
}

// Reset data to defaults (useful for testing)
export function resetToDefaults(): void {
  if (!isBrowser) return
  
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(defaultPatients))
  localStorage.setItem(HOSPITALS_KEY, JSON.stringify(defaultHospitals))
  localStorage.removeItem(LOGGED_IN_HOSPITAL_KEY)
}

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: "admin@medihub.com",
  password: "admin123",
}
