/**
 * Production-ready Prisma Schema definition for GrandHorizon HMS & IMS Suite
 * Demonstrates relational mapping across PMS, Inventory, Multi-location Warehouses,
 * PO Lifecycle, Room-Inventory Consumption Linkage, and Guest Billing/Folios.
 */

export const PRISMA_SCHEMA_CONTENT = `// This is your Prisma schema file
// datasource db: PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

enum RoomCategory {
  STANDARD
  DELUXE
  SUITE
  PRESIDENTIAL
}

enum RoomStatus {
  AVAILABLE
  OCCUPIED
  DIRTY
  MAINTENANCE
  CHECKED_OUT
}

enum BookingStatus {
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
}

enum FolioStatus {
  OPEN
  SETTLED
  CLOSED
}

enum ChargeCategory {
  ROOM_CHARGE
  TAX
  FOOD_BEVERAGE
  MINIBAR
  SPA
  LAUNDRY
  PARKING
  MISC
}

enum InventoryCategory {
  LINEN
  TOILETRIES
  FOOD_BEVERAGE
  CLEANING_CHEMICALS
  MINIBAR
  ROOM_AMENITIES
}

enum PoStatus {
  DRAFT
  SENT
  PARTIALLY_RECEIVED
  FULFILLED
  CANCELLED
}

enum MaintenancePriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum MaintenanceStatus {
  OPEN
  ASSIGNED
  IN_PROGRESS
  RESOLVED
}

// -------------------------------------------------------------
// PMS: PROPERTY MANAGEMENT & GUEST RELATIONS
// -------------------------------------------------------------

model Room {
  id              String         @id @default(uuid())
  roomNumber      String         @unique @map("room_number")
  floor           Int
  category        RoomCategory   @default(STANDARD)
  pricePerNight   Decimal        @map("price_per_night") @db.Decimal(10, 2)
  status          RoomStatus     @default(AVAILABLE)
  maxOccupancy    Int            @default(2) @map("max_occupancy")
  bedConfig       String         @map("bed_config")
  amenities       String[]       @default([])
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  // Relational links
  bookings              Booking[]
  housekeepingTasks     HousekeepingTask[]
  maintenanceTickets    MaintenanceTicket[]
  inventoryConsumptions InventoryConsumption[]

  @@index([status, floor])
  @@map("rooms")
}

model Guest {
  id          String   @id @default(uuid())
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  email       String   @unique
  phone       String
  idType      String   @map("id_type") // PASSPORT, DRIVERS_LICENSE, etc.
  idNumber    String   @map("id_number")
  nationality String   @default("Unknown")
  vipStatus   Boolean  @default(false) @map("vip_status")
  notes       String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  bookings    Booking[]

  @@index([lastName, firstName])
  @@map("guests")
}

model Booking {
  id               String        @id @default(uuid())
  bookingReference String        @unique @map("booking_reference")
  roomId           String        @map("room_id")
  guestId          String        @map("guest_id")
  checkInDate      DateTime      @map("check_in_date")
  checkOutDate     DateTime      @map("check_out_date")
  actualCheckIn    DateTime?     @map("actual_check_in")
  actualCheckOut   DateTime?     @map("actual_check_out")
  numberOfGuests   Int           @default(1) @map("number_of_guests")
  ratePerNight     Decimal       @map("rate_per_night") @db.Decimal(10, 2)
  totalNights      Int           @map("total_nights")
  status           BookingStatus @default(CONFIRMED)
  specialRequests  String?       @map("special_requests")
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  room             Room          @relation(fields: [roomId], references: [id], onDelete: Restrict)
  guest            Guest         @relation(fields: [guestId], references: [id], onDelete: Cascade)
  folio            Folio?
  inventoryConsumptions InventoryConsumption[]

  @@index([roomId, status])
  @@index([checkInDate, checkOutDate])
  @@map("bookings")
}

// -------------------------------------------------------------
// GUEST BILLING & FOLIO SYSTEM
// -------------------------------------------------------------

model Folio {
  id          String       @id @default(uuid())
  bookingId   String       @unique @map("booking_id")
  status      FolioStatus  @default(OPEN)
  subtotal    Decimal      @default(0.00) @db.Decimal(10, 2)
  taxAmount   Decimal      @default(0.00) @map("tax_amount") @db.Decimal(10, 2)
  totalAmount Decimal      @default(0.00) @map("total_amount") @db.Decimal(10, 2)
  paidAmount  Decimal      @default(0.00) @map("paid_amount") @db.Decimal(10, 2)
  balanceDue  Decimal      @default(0.00) @map("balance_due") @db.Decimal(10, 2)
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  booking     Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  items       FolioItem[]
  payments    Payment[]

  @@map("folios")
}

model FolioItem {
  id          String         @id @default(uuid())
  folioId     String         @map("folio_id")
  category    ChargeCategory
  description String
  amount      Decimal        @db.Decimal(10, 2)
  postedBy    String         @default("SYSTEM") @map("posted_by")
  referenceId String?        @map("reference_id") // POS Order ID, Service ref
  createdAt   DateTime       @default(now()) @map("created_at")

  folio       Folio          @relation(fields: [folioId], references: [id], onDelete: Cascade)

  @@index([folioId])
  @@map("folio_items")
}

model Payment {
  id              String   @id @default(uuid())
  folioId         String   @map("folio_id")
  amount          Decimal  @db.Decimal(10, 2)
  method          String   // CREDIT_CARD, CASH, BANK_TRANSFER
  referenceNumber String   @map("reference_number")
  createdAt       DateTime @default(now()) @map("created_at")

  folio           Folio    @relation(fields: [folioId], references: [id], onDelete: Cascade)

  @@index([folioId])
  @@map("payments")
}

// -------------------------------------------------------------
// INTEGRATED INVENTORY MANAGEMENT (IMS)
// -------------------------------------------------------------

model WarehouseLocation {
  id          String   @id
  name        String
  code        String   @unique
  floor       Int?
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  stocks      ItemLocationStock[]
  transfersFrom StockTransfer[]   @relation("SourceLocation")
  transfersTo   StockTransfer[]   @relation("TargetLocation")
  purchaseOrders PurchaseOrder[]
  consumptions InventoryConsumption[]

  @@map("warehouse_locations")
}

model InventoryItem {
  id                    String            @id @default(uuid())
  sku                   String            @unique
  name                  String
  category              InventoryCategory
  unit                  String            // pack, bottle, set, roll
  unitCost              Decimal           @map("unit_cost") @db.Decimal(10, 2)
  minSafetyStock        Int               @default(20) @map("min_safety_stock")
  targetStockLevel      Int               @default(100) @map("target_stock_level")
  autoDeductOnCheckInQty Int              @default(0) @map("auto_deduct_on_checkin_qty")
  supplierId            String            @map("supplier_id")
  createdAt             DateTime          @default(now()) @map("created_at")
  updatedAt             DateTime          @updatedAt @map("updated_at")

  supplier              Vendor            @relation(fields: [supplierId], references: [id])
  locationStocks        ItemLocationStock[]
  transferItems         StockTransfer[]
  poItems               PurchaseOrderItem[]
  consumptions          InventoryConsumption[]

  @@index([category, sku])
  @@map("inventory_items")
}

model ItemLocationStock {
  id          String            @id @default(uuid())
  itemId      String            @map("item_id")
  locationId  String            @map("location_id")
  quantity    Int               @default(0)
  updatedAt   DateTime          @updatedAt @map("updated_at")

  item        InventoryItem     @relation(fields: [itemId], references: [id], onDelete: Cascade)
  location    WarehouseLocation @relation(fields: [locationId], references: [id], onDelete: Cascade)

  @@unique([itemId, locationId])
  @@map("item_location_stocks")
}

// Internal transfers across locations (e.g., Main Warehouse -> Floor Linen Closet)
model StockTransfer {
  id             String            @id @default(uuid())
  reference      String            @unique
  itemId         String            @map("item_id")
  fromLocationId String            @map("from_location_id")
  toLocationId   String            @map("to_location_id")
  quantity       Int
  reason         String
  transferredBy  String            @map("transferred_by")
  createdAt      DateTime          @default(now()) @map("created_at")

  item           InventoryItem     @relation(fields: [itemId], references: [id])
  fromLocation   WarehouseLocation @relation("SourceLocation", fields: [fromLocationId], references: [id])
  toLocation     WarehouseLocation @relation("TargetLocation", fields: [toLocationId], references: [id])

  @@map("stock_transfers")
}

// DIRECT LINKAGE: Inventory Consumption linked to Room & Booking!
// When guest checks in, or housekeeping prepares a room, items are deducted and logged here.
model InventoryConsumption {
  id            String            @id @default(uuid())
  itemId        String            @map("item_id")
  locationId    String            @map("location_id")
  roomId        String            @map("room_id")
  bookingId     String?           @map("booking_id")
  quantity      Int
  triggerEvent  String            @map("trigger_event") // CHECK_IN, HOUSEKEEPING_TURNOVER, MINIBAR_RESTOCK
  consumedBy    String            @default("SYSTEM") @map("consumed_by")
  createdAt     DateTime          @default(now()) @map("created_at")

  item          InventoryItem     @relation(fields: [itemId], references: [id])
  location      WarehouseLocation @relation(fields: [locationId], references: [id])
  room          Room              @relation(fields: [roomId], references: [id])
  booking       Booking?          @relation(fields: [bookingId], references: [id])

  @@index([roomId, triggerEvent])
  @@map("inventory_consumptions")
}

// -------------------------------------------------------------
// VENDORS & PURCHASE ORDERS (PO)
// -------------------------------------------------------------

model Vendor {
  id            String          @id @default(uuid())
  name          String
  contactPerson String          @map("contact_person")
  email         String
  phone         String
  category      InventoryCategory
  paymentTerms  String          @default("NET_30") @map("payment_terms")
  createdAt     DateTime        @default(now()) @map("created_at")

  items         InventoryItem[]
  purchaseOrders PurchaseOrder[]

  @@map("vendors")
}

model PurchaseOrder {
  id                   String            @id @default(uuid())
  poNumber             String            @unique @map("po_number")
  vendorId             String            @map("vendor_id")
  targetWarehouseId    String            @map("target_warehouse_id")
  status               PoStatus          @default(DRAFT)
  totalAmount          Decimal           @default(0.00) @map("total_amount") @db.Decimal(10, 2)
  notes                String?
  expectedDeliveryDate DateTime          @map("expected_delivery_date")
  sentDate             DateTime?         @map("sent_date")
  receivedDate         DateTime?         @map("received_date")
  createdAt            DateTime          @default(now()) @map("created_at")
  updatedAt            DateTime          @updatedAt @map("updated_at")

  vendor               Vendor            @relation(fields: [vendorId], references: [id])
  targetWarehouse      WarehouseLocation @relation(fields: [targetWarehouseId], references: [id])
  items                PurchaseOrderItem[]

  @@index([vendorId, status])
  @@map("purchase_orders")
}

model PurchaseOrderItem {
  id               String        @id @default(uuid())
  poId             String        @map("po_id")
  itemId           String        @map("item_id")
  quantityOrdered  Int           @map("quantity_ordered")
  quantityReceived Int           @default(0) @map("quantity_received")
  unitPrice        Decimal       @map("unit_price") @db.Decimal(10, 2)
  totalPrice       Decimal       @map("total_price") @db.Decimal(10, 2)

  po               PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  item             InventoryItem @relation(fields: [itemId], references: [id])

  @@map("purchase_order_items")
}

// -------------------------------------------------------------
// HOUSEKEEPING & MAINTENANCE TICKETS
// -------------------------------------------------------------

model HousekeepingTask {
  id            String   @id @default(uuid())
  roomId        String   @map("room_id")
  assignedStaff String   @map("assigned_staff")
  taskType      String   @map("task_type") // DEPARTURE_CLEAN, STAYOVER, DEEP_CLEAN
  status        String   @default("PENDING") // PENDING, IN_PROGRESS, COMPLETED, INSPECTED
  priority      String   @default("MEDIUM")
  notes         String?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  room          Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@index([roomId, status])
  @@map("housekeeping_tasks")
}

model MaintenanceTicket {
  id           String              @id @default(uuid())
  ticketNumber String              @unique @map("ticket_number")
  roomId       String              @map("room_id")
  category     String              // PLUMBING, HVAC, ELECTRICAL, FURNITURE
  description  String
  priority     MaintenancePriority @default(MEDIUM)
  status       MaintenanceStatus   @default(OPEN)
  assignedTo   String?             @map("assigned_to")
  locksRoom    Boolean             @default(true) @map("locks_room")
  createdAt    DateTime            @default(now()) @map("created_at")
  resolvedAt   DateTime?           @map("resolved_at")

  room         Room                @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@index([roomId, status])
  @@map("maintenance_tickets")
}
`;
