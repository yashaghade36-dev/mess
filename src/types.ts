export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  hostelBlock?: string;
  roomNo?: string;
  phone?: string;
  avatar?: string;
}

export type FeeStatus = 'pending' | 'paid' | 'under_verification';

export interface MessFee {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  baseAmount: number;
  maintenanceAmount: number;
  specialCharges: number;
  totalAmount: number;
  dueDate: string;
  status: FeeStatus;
  paidAt?: string;
  utrNumber?: string;
  receiptId?: string;
}

export interface PaymentRecord {
  id: string;
  feeId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  month: string;
  amount: number;
  utrNumber: string;
  paymentDate: string;
  status: 'approved' | 'pending' | 'rejected';
  paymentMethod: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MenuItem {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  price: number; // 0 if included in mess plan
  isAvailable: boolean;
  imageEmoji: string;
  calories: number;
  dietary: 'veg' | 'non-veg' | 'vegan';
}

export interface PickupSlot {
  id: string;
  mealType: MealCategory;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isActive: boolean;
}

export type OrderStatus = 'booked' | 'preparing' | 'ready' | 'collected' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  imageEmoji?: string;
}

export interface MealOrder {
  id: string;
  tokenNumber: string; // e.g. "B-104"
  studentId: string;
  studentName: string;
  studentRoll: string;
  hostelBlock?: string;
  date: string;
  slotId: string;
  slotTime: string;
  mealType: MealCategory;
  items: OrderItem[];
  totalQuantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  readyAt?: string;
  collectedAt?: string;
  specialInstructions?: string;
}

export interface NotificationItem {
  id: string;
  studentId: string; // 'all' or specific studentId
  title: string;
  message: string;
  type: 'fee' | 'meal' | 'general';
  date: string;
  read: boolean;
}

export interface UpiSettings {
  upiId: string;
  payeeName: string;
  qrCodeUrl: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  lastUpdated: string;
}

export interface MessConfig {
  defaultMonthlyFee: number;
  defaultDueDate: string;
  breakfastPreOrderCutoff: string;
  messContactPhone: string;
  messContactEmail: string;
}
