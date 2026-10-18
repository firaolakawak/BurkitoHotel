/**
 * Domain Type Definitions for GrandHorizon HMS & IMS Suite
 */

export type RoomCategory = 'STANDARD' | 'DELUXE' | 'SUITE' | 'PRESIDENTIAL';

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE' | 'CHECKED_OUT';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  pricePerNight: number;
  status: RoomStatus;
  maxOccupancy: number;
  bedConfig: string;
  amenities: string[];
  currentBookingId?: string | null;
  cleaningStatus?: 'CLEAN' | 'IN_PROGRESS' | 'NEEDS_CLEANING' | 'INSPECTED';
  activeMaintenanceTicketId?: string | null;
}

export interface GuestRoomPreferences {
  preferredRoomCategory?: string;
  floorPreference?: string;
  bedAndPillow?: string;
  temperaturePreference?: string;
  minibarAndDining?: string[];
  specialRequests?: string[];
  dietaryRestrictions?: string[];
  allergies?: string[];
  notes?: string;
}

export interface GuestPastStay {
  id: string;
  bookingReference: string;
  roomNumber: string;
  roomCategory: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  ratePerNight: number;
  roomTotal: number;
  extrasTotal: number;
  totalSpend: number;
  status: 'COMPLETED' | 'CHECKED_IN' | 'CANCELLED';
  chargesSummary?: {
    category: string;
    description: string;
    amount: number;
  }[];
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  idNumber: string;
  nationality: string;
  vipStatus: boolean;
  vipTier?: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  memberSince?: string;
  lifetimeSpend?: number;
  totalStaysCount?: number;
  totalNightsCount?: number;
  notes?: string;
  roomPreferences?: GuestRoomPreferences;
  pastStays?: GuestPastStay[];
  createdAt: string;
}

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Booking {
  id: string;
  bookingReference: string;
  roomId: string;
  guestId: string;
  guest?: Guest;
  room?: Room;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  numberOfGuests: number;
  status: BookingStatus;
  specialRequests?: string;
  ratePerNight: number;
  totalNights: number;
  folioId: string;
  createdAt: string;
}

export type FolioChargeCategory = 
  | 'ROOM_CHARGE' 
  | 'TAX' 
  | 'FOOD_BEVERAGE' 
  | 'MINIBAR' 
  | 'SPA' 
  | 'LAUNDRY' 
  | 'PARKING' 
  | 'MISC';

export interface FolioItem {
  id: string;
  folioId: string;
  category: FolioChargeCategory;
  description: string;
  amount: number;
  date: string;
  postedBy: string;
  referenceId?: string; // POS order ID, etc.
}

export interface FolioPayment {
  id: string;
  folioId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER' | 'VOUCHER';
  date: string;
  referenceNumber: string;
}

export interface GuestFolio {
  id: string;
  bookingId: string;
  status: 'OPEN' | 'SETTLED' | 'CLOSED';
  items: FolioItem[];
  payments: FolioPayment[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
}

// ---------------- INVENTORY MANAGEMENT TYPES ----------------

export type InventoryCategory = 
  | 'LINEN' 
  | 'TOILETRIES' 
  | 'FOOD_BEVERAGE' 
  | 'CLEANING_CHEMICALS' 
  | 'MINIBAR' 
  | 'ROOM_AMENITIES'
  | 'CLEANING_SUPPLIES'
  | 'FNB_SUPPLIES'
  | 'MAINTENANCE'
  | 'OFFICE_SUPPLIES'
  | 'OTHERS';

export type WarehouseLocationId = 'MAIN_WAREHOUSE' | 'FLOOR_LINEN_CLOSET' | 'KITCHEN_PANTRY';

export interface WarehouseLocation {
  id: WarehouseLocationId;
  name: string;
  code: string;
  floor?: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  sku: string; // e.g. 'AM-001'
  name: string;
  specs?: string; // e.g. '70 x 140 cm, 500 GSM'
  description?: string;
  category: InventoryCategory;
  categoryLabel?: string;
  unit: string; // 'Piece', 'Roll', 'Canister', 'kg', 'pack'
  unitCost: number;
  minSafetyStock: number; // Reorder level
  targetStockLevel: number;
  supplierId: string;
  supplierName: string;
  stockByLocation: Record<WarehouseLocationId, number>;
  totalStock: number;
  barcode?: string;
  leadTime?: string;
  locationShelf?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
  lastRestockedDate?: string;
  autoDeductOnCheckInQty?: number;
}

export interface StockTransfer {
  id: string;
  reference: string;
  itemId: string;
  itemName: string;
  fromLocation: WarehouseLocationId;
  toLocation: WarehouseLocationId;
  quantity: number;
  reason: string;
  transferredBy: string;
  timestamp: string;
}

export type PurchaseOrderStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_RECEIVED' | 'FULFILLED' | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  targetWarehouse: WarehouseLocationId;
  createdAt: string;
  sentDate?: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: InventoryCategory;
  paymentTerms: string;
}

// ---------------- HOUSEKEEPING & MAINTENANCE ----------------

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  assignedStaff: string;
  taskType: 'DEPARTURE_CLEAN' | 'STAYOVER_CLEAN' | 'DEEP_CLEAN' | 'INSPECTION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  suppliesUsed?: { itemId: string; name: string; qty: number }[];
  notes?: string;
  updatedAt: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  roomId: string;
  roomNumber: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'FURNITURE' | 'KEYCARD' | 'OTHER';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo?: string;
  locksRoom: boolean;
  createdAt: string;
  resolvedAt?: string;
}

// ---------------- POS TYPES ----------------

export interface PosProduct {
  id: string;
  name: string;
  category: 'BREAKFAST' | 'DINING' | 'BEVERAGE' | 'SPA' | 'MINIBAR';
  price: number;
  linkedInventorySku?: string;
  inventoryDeductionQty?: number;
}

export interface PosOrderRequest {
  roomNumber: string;
  items: { product: PosProduct; quantity: number }[];
  tipAmount?: number;
  serviceNotes?: string;
  serverName: string;
}

// ---------------- STAFF MANAGEMENT TYPES ----------------

export type StaffDepartment =
  | 'Management'
  | 'Front Office'
  | 'Housekeeping'
  | 'Maintenance'
  | 'F&B'
  | 'Sales & Marketing'
  | 'IT'
  | 'Security';

export type StaffStatus = 'Active' | 'On Leave' | 'Suspended';

export type WorkType = 'Full Time' | 'Part Time' | 'Contract';

export interface StaffActivity {
  id: string;
  type: 'checkin' | 'schedule' | 'training' | 'leave';
  title: string;
  time: string;
  details?: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. EMP-001
  name: string;
  avatar: string;
  department: StaffDepartment;
  position: string;
  status: StaffStatus;
  workType: WorkType;
  phone: string;
  email: string;
  joinDate: string;
  tenure: string;
  managerName: string;
  managerPosition: string;
  managerAvatar: string;
  shift?: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night (23:00 - 07:30)';
  todayAttendance?: {
    status: 'Checked In' | 'On Leave' | 'Scheduled' | 'Late';
    time?: string;
  };
  activities: StaffActivity[];
}

