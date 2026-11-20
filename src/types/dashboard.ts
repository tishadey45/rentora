export type DashboardRole = "customer" | "owner" | "admin"

export type UserRole = DashboardRole

export type EquipmentStatus = "pending" | "approved" | "rejected"

export type PaymentStatus = "paid" | "pending" | "refunded"

export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled"

export type AvailabilityStatus = "available" | "limited" | "unavailable"

export type RentalType = "Daily" | "Weekly" | "Monthly"

export type UserAccountStatus = "active" | "suspended"

export type ActivityTone = "success" | "info" | "warning" | "danger"

export type StatIconKey =
  | "rentals"
  | "active"
  | "favorites"
  | "completed"
  | "pendingBookings"
  | "spent"
  | "equipment"
  | "approved"
  | "pending"
  | "bookings"
  | "earnings"
  | "users"
  | "customers"
  | "owners"
  | "revenue"

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  address?: string
  joinedAt?: string
  imageUrl?: string
}

export interface RentalRecord {
  id: string
  equipmentName: string
  equipmentImage: string
  customerName: string
  customerEmail: string
  ownerName: string
  startDate: string
  endDate: string
  bookingDate: string
  quantity: number
  totalAmount: number
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
}

export interface FavoriteRecord {
  id: string
  name: string
  image: string
  category: string
  rentalPrice: number
  rentalType: RentalType
  location: string
  availability: AvailabilityStatus
}

export interface OwnerEquipmentRecord {
  id: string
  name: string
  image: string
  category: string
  rentalPrice: number
  rentalType: RentalType
  quantity: number
  status: EquipmentStatus
  ownerName: string
  condition: string
  brand: string
  model: string
}

export interface AdminUserRecord {
  id: string
  name: string
  email: string
  role: UserRole
  joinedAt: string
  status: UserAccountStatus
}

export interface ActivityRecord {
  id: string
  title: string
  description: string
  date: string
  tone: ActivityTone
}

export interface StatRecord {
  label: string
  value: string
  detail: string
  icon: StatIconKey
}