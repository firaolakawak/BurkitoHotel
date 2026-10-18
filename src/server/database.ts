/**
 * In-Memory Transactional Database Store for Aurelia Hospitality Cloud
 * Seeded with exact Floor 5 rooms (501 to 524), guests, arrivals, departures, and housekeeping queues.
 */

import {
  Room,
  Guest,
  Booking,
  GuestFolio,
  InventoryItem,
  WarehouseLocation,
  StockTransfer,
  PurchaseOrder,
  HousekeepingTask,
  MaintenanceTicket,
  PosProduct,
  WarehouseLocationId
} from '../types/index.ts';
import { getGuestProfileEnrichment } from '../data/guestData.ts';

export class HotelDatabase {
  rooms: Map<string, Room> = new Map();
  guests: Map<string, Guest> = new Map();
  bookings: Map<string, Booking> = new Map();
  folios: Map<string, GuestFolio> = new Map();
  warehouseLocations: Map<string, WarehouseLocation> = new Map();
  inventoryItems: Map<string, InventoryItem> = new Map();
  stockTransfers: StockTransfer[] = [];
  purchaseOrders: Map<string, PurchaseOrder> = new Map();
  housekeepingTasks: Map<string, HousekeepingTask> = new Map();
  maintenanceTickets: Map<string, MaintenanceTicket> = new Map();
  posProducts: PosProduct[] = [];
  inventoryConsumptionLogs: Array<{
    id: string;
    itemId: string;
    itemName: string;
    roomId: string;
    roomNumber: string;
    quantity: number;
    locationId: WarehouseLocationId;
    trigger: string;
    timestamp: string;
  }> = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Warehouse Locations
    const locations: WarehouseLocation[] = [
      {
        id: 'MAIN_WAREHOUSE',
        name: 'Main Central Logistics Hub',
        code: 'WH-CENTRAL',
        floor: 0,
        description: 'Primary receiving dock and bulk storage for all hotel departments.'
      },
      {
        id: 'FLOOR_LINEN_CLOSET',
        name: 'Floor 5 Linen Staging Closet',
        code: 'CLOSET-FL5',
        floor: 5,
        description: 'Active replenishment station for luxury floor housekeeping teams.'
      },
      {
        id: 'KITCHEN_PANTRY',
        name: 'Executive Kitchen & Bar Store',
        code: 'PANTRY-KIT-01',
        floor: 1,
        description: 'Temperature-controlled storage for dining and minibar provisions.'
      }
    ];
    locations.forEach(l => this.warehouseLocations.set(l.id, l));

    // 2. Inventory Items matching exact Aurelia IMS table
    const items: InventoryItem[] = [
      {
        id: 'inv-1',
        sku: 'AM-001',
        name: 'Bath Towel (White)',
        specs: '70 x 140 cm, 500 GSM',
        description: 'Premium white bath towel, 70 x 140 cm, 500 GSM, 100% cotton.',
        category: 'ROOM_AMENITIES',
        categoryLabel: 'Room Amenities',
        unit: 'Piece',
        unitCost: 12.00,
        minSafetyStock: 100,
        targetStockLevel: 250,
        supplierId: 'v-cleanpro',
        supplierName: 'CleanPro Supplies LLC',
        barcode: '1234567890123',
        leadTime: '7 days',
        locationShelf: 'Main Store - Shelf A1',
        createdDate: '10 Jan 2025',
        lastUpdatedDate: '12 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 6, FLOOR_LINEN_CLOSET: 2, KITCHEN_PANTRY: 0 },
        totalStock: 8,
        autoDeductOnCheckInQty: 2
      },
      {
        id: 'inv-2',
        sku: 'AM-002',
        name: 'Hand Towel (White)',
        specs: '50 x 90 cm',
        description: 'Plush combed cotton hand towel for guest bathrooms.',
        category: 'ROOM_AMENITIES',
        categoryLabel: 'Room Amenities',
        unit: 'Piece',
        unitCost: 6.50,
        minSafetyStock: 50,
        targetStockLevel: 150,
        supplierId: 'v-cleanpro',
        supplierName: 'CleanPro Supplies LLC',
        barcode: '1234567890124',
        leadTime: '5 days',
        locationShelf: 'Main Store - Shelf A2',
        createdDate: '10 Jan 2025',
        lastUpdatedDate: '10 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 80, FLOOR_LINEN_CLOSET: 40, KITCHEN_PANTRY: 0 },
        totalStock: 120,
        autoDeductOnCheckInQty: 2
      },
      {
        id: 'inv-3',
        sku: 'CS-001',
        name: 'Toilet Paper Roll',
        specs: '3-ply, 200 sheets',
        description: 'Ultra-soft embossed 3-ply virgin bamboo pulp paper.',
        category: 'CLEANING_SUPPLIES',
        categoryLabel: 'Cleaning Supplies',
        unit: 'Roll',
        unitCost: 2.00,
        minSafetyStock: 200,
        targetStockLevel: 500,
        supplierId: 'v-eco',
        supplierName: 'EcoHygiene Essentials',
        barcode: '1234567890125',
        leadTime: '3 days',
        locationShelf: 'Housekeeping Bay B1',
        createdDate: '15 Jan 2025',
        lastUpdatedDate: '14 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 10, FLOOR_LINEN_CLOSET: 2, KITCHEN_PANTRY: 0 },
        totalStock: 12,
        autoDeductOnCheckInQty: 4
      },
      {
        id: 'inv-4',
        sku: 'CS-002',
        name: 'All-Purpose Cleaner',
        specs: '5L',
        description: 'Hospital-grade biodegradable surface degreaser and sanitizer.',
        category: 'CLEANING_SUPPLIES',
        categoryLabel: 'Cleaning Supplies',
        unit: 'Canister',
        unitCost: 18.00,
        minSafetyStock: 30,
        targetStockLevel: 80,
        supplierId: 'v-eco',
        supplierName: 'EcoHygiene Essentials',
        barcode: '1234567890126',
        leadTime: '4 days',
        locationShelf: 'Chemical Store C1',
        createdDate: '18 Jan 2025',
        lastUpdatedDate: '08 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 35, FLOOR_LINEN_CLOSET: 10, KITCHEN_PANTRY: 0 },
        totalStock: 45
      },
      {
        id: 'inv-5',
        sku: 'FB-001',
        name: 'Coffee Beans',
        specs: '1kg, Arabica',
        description: 'Single-origin Colombian medium dark espresso roast.',
        category: 'FNB_SUPPLIES',
        categoryLabel: 'F&B Supplies',
        unit: 'kg',
        unitCost: 45.00,
        minSafetyStock: 50,
        targetStockLevel: 120,
        supplierId: 'v-roast',
        supplierName: 'Artisan Roast Roastery',
        barcode: '1234567890127',
        leadTime: '2 days',
        locationShelf: 'Kitchen Pantry K1',
        createdDate: '01 Feb 2025',
        lastUpdatedDate: '13 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 2, FLOOR_LINEN_CLOSET: 0, KITCHEN_PANTRY: 3 },
        totalStock: 5
      },
      {
        id: 'inv-6',
        sku: 'FB-002',
        name: 'Tea Bags',
        specs: '100 packs',
        description: 'Organic Earl Grey & Jasmine luxury silken pyramids.',
        category: 'FNB_SUPPLIES',
        categoryLabel: 'F&B Supplies',
        unit: 'Box',
        unitCost: 15.00,
        minSafetyStock: 40,
        targetStockLevel: 100,
        supplierId: 'v-tea',
        supplierName: 'Ceylon Heritage Tea',
        barcode: '1234567890128',
        leadTime: '5 days',
        locationShelf: 'Kitchen Pantry K2',
        createdDate: '05 Feb 2025',
        lastUpdatedDate: '11 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 50, FLOOR_LINEN_CLOSET: 10, KITCHEN_PANTRY: 20 },
        totalStock: 80
      },
      {
        id: 'inv-7',
        sku: 'MT-001',
        name: 'LED Bulb (9W)',
        specs: 'Warm White',
        description: 'Energy-star 2700K E27 dimmable architectural bulb.',
        category: 'MAINTENANCE',
        categoryLabel: 'Maintenance',
        unit: 'Piece',
        unitCost: 8.00,
        minSafetyStock: 30,
        targetStockLevel: 80,
        supplierId: 'v-tech',
        supplierName: 'Luminary Lighting Co.',
        barcode: '1234567890129',
        leadTime: '3 days',
        locationShelf: 'Engineering Workshop W1',
        createdDate: '12 Feb 2025',
        lastUpdatedDate: '14 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 3, FLOOR_LINEN_CLOSET: 0, KITCHEN_PANTRY: 0 },
        totalStock: 3
      },
      {
        id: 'inv-8',
        sku: 'MT-002',
        name: 'Door Lock Battery',
        specs: 'AA Alkaline',
        description: 'Industrial high-drain lithium-alkaline cells for VingCard RFID locks.',
        category: 'MAINTENANCE',
        categoryLabel: 'Maintenance',
        unit: 'Pack',
        unitCost: 4.00,
        minSafetyStock: 20,
        targetStockLevel: 100,
        supplierId: 'v-power',
        supplierName: 'Voltaic Systems',
        barcode: '1234567890130',
        leadTime: '3 days',
        locationShelf: 'Engineering Workshop W2',
        createdDate: '14 Feb 2025',
        lastUpdatedDate: '09 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 50, FLOOR_LINEN_CLOSET: 10, KITCHEN_PANTRY: 0 },
        totalStock: 60
      },
      {
        id: 'inv-9',
        sku: 'OF-001',
        name: 'A4 Paper',
        specs: '500 sheets',
        description: 'Premium 80 GSM ultra-white laser printing paper for front desk invoices.',
        category: 'OFFICE_SUPPLIES',
        categoryLabel: 'Office Supplies',
        unit: 'Ream',
        unitCost: 14.00,
        minSafetyStock: 100,
        targetStockLevel: 300,
        supplierId: 'v-stationery',
        supplierName: 'Apex Office Direct',
        barcode: '1234567890131',
        leadTime: '1 day',
        locationShelf: 'Front Desk Archives F1',
        createdDate: '20 Feb 2025',
        lastUpdatedDate: '12 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 150, FLOOR_LINEN_CLOSET: 0, KITCHEN_PANTRY: 50 },
        totalStock: 200
      },
      {
        id: 'inv-10',
        sku: 'OF-002',
        name: 'Printer Toner',
        specs: 'HP 142A',
        description: 'Original high-yield LaserJet black cartridge.',
        category: 'OFFICE_SUPPLIES',
        categoryLabel: 'Office Supplies',
        unit: 'Cartridge',
        unitCost: 220.00,
        minSafetyStock: 10,
        targetStockLevel: 25,
        supplierId: 'v-stationery',
        supplierName: 'Apex Office Direct',
        barcode: '1234567890132',
        leadTime: '2 days',
        locationShelf: 'Front Desk Archives F2',
        createdDate: '22 Feb 2025',
        lastUpdatedDate: '11 Oct 2025',
        stockByLocation: { MAIN_WAREHOUSE: 12, FLOOR_LINEN_CLOSET: 0, KITCHEN_PANTRY: 3 },
        totalStock: 15
      }
    ];
    items.forEach(i => this.inventoryItems.set(i.id, i));

    // 3. Exact Floor 5 Rooms (501 through 524) as seen in the Image:
    const floor5RoomsData: Array<{
      roomNumber: string;
      category: 'STANDARD' | 'DELUXE' | 'SUITE';
      status: 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'MAINTENANCE' | 'CHECKED_OUT';
      price: number;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      resNumber?: string;
    }> = [
      { roomNumber: '501', category: 'SUITE', status: 'AVAILABLE', price: 1200 },
      { roomNumber: '502', category: 'DELUXE', status: 'OCCUPIED', price: 850, guestName: 'John Smith', guestEmail: 'john.smith@email.com', guestPhone: '+971 50 123 4567', resNumber: 'RES-45872' },
      { roomNumber: '503', category: 'DELUXE', status: 'DIRTY', price: 850 },
      { roomNumber: '504', category: 'STANDARD', status: 'AVAILABLE', price: 850 },
      { roomNumber: '505', category: 'DELUXE', status: 'OCCUPIED', price: 850, guestName: 'Emma Wilson', guestEmail: 'e.wilson@corp.co.uk', guestPhone: '+44 7700 900123', resNumber: 'RES-45873' },
      { roomNumber: '506', category: 'SUITE', status: 'MAINTENANCE', price: 1200 },

      { roomNumber: '507', category: 'STANDARD', status: 'AVAILABLE', price: 650 },
      { roomNumber: '508', category: 'DELUXE', status: 'OCCUPIED', price: 850, guestName: 'Robert Chen', guestEmail: 'r.chen@apex-group.sg', guestPhone: '+65 9123 4567', resNumber: 'RES-45874' },
      { roomNumber: '509', category: 'STANDARD', status: 'DIRTY', price: 650 },
      { roomNumber: '510', category: 'DELUXE', status: 'OCCUPIED', price: 850, guestName: 'Maria Garcia', guestEmail: 'm.garcia@iberia-lux.es', guestPhone: '+34 600 123 456', resNumber: 'RES-45875' },
      { roomNumber: '511', category: 'SUITE', status: 'AVAILABLE', price: 1200 },
      { roomNumber: '512', category: 'STANDARD', status: 'CHECKED_OUT', price: 650 },

      { roomNumber: '513', category: 'DELUXE', status: 'AVAILABLE', price: 850 },
      { roomNumber: '514', category: 'STANDARD', status: 'OCCUPIED', price: 650, guestName: 'David Kim', guestEmail: 'd.kim@seoul-tech.kr', guestPhone: '+82 10 1234 5678', resNumber: 'RES-45876' },
      { roomNumber: '515', category: 'DELUXE', status: 'AVAILABLE', price: 850 },
      { roomNumber: '516', category: 'STANDARD', status: 'DIRTY', price: 650 },
      { roomNumber: '517', category: 'DELUXE', status: 'AVAILABLE', price: 850 },
      { roomNumber: '518', category: 'SUITE', status: 'OCCUPIED', price: 1200, guestName: 'Lisa Brown', guestEmail: 'lisa.brown@global-cap.com', guestPhone: '+1 (415) 555-0199', resNumber: 'RES-45877' },

      { roomNumber: '519', category: 'STANDARD', status: 'AVAILABLE', price: 650 },
      { roomNumber: '520', category: 'DELUXE', status: 'OCCUPIED', price: 850, guestName: 'Ahmed Ali', guestEmail: 'ahmed.ali@emirates-holding.ae', guestPhone: '+971 55 987 6543', resNumber: 'RES-45878' },
      { roomNumber: '521', category: 'STANDARD', status: 'MAINTENANCE', price: 650 },
      { roomNumber: '522', category: 'DELUXE', status: 'AVAILABLE', price: 850 },
      { roomNumber: '523', category: 'SUITE', status: 'OCCUPIED', price: 1200, guestName: 'Sophie Martin', guestEmail: 's.martin@elysee-parfum.fr', guestPhone: '+33 6 12 34 56 78', resNumber: 'RES-45879' },
      { roomNumber: '524', category: 'STANDARD', status: 'AVAILABLE', price: 650 }
    ];

    floor5RoomsData.forEach((rData, index) => {
      const roomId = `rm-${rData.roomNumber}`;
      const room: Room = {
        id: roomId,
        roomNumber: rData.roomNumber,
        floor: 5,
        category: rData.category,
        pricePerNight: rData.price,
        status: rData.status,
        maxOccupancy: rData.category === 'SUITE' ? 4 : 2,
        bedConfig: rData.category === 'SUITE' ? '1 King Bed + Living Area' : '1 King Bed',
        amenities: ['High-speed Wi-Fi', 'Smart TV 55"', 'Rain Shower', 'Espresso Machine', 'Mini Bar', 'Ocean View Balcony']
      };

      if (rData.status === 'OCCUPIED' && rData.guestName) {
        const guestId = `g-${rData.roomNumber}`;
        const [first, ...rest] = rData.guestName.split(' ');
        const last = rest.join(' ');
        const enrichment = getGuestProfileEnrichment(rData.guestName, rData.category, rData.price);
        const guest: Guest = {
          id: guestId,
          firstName: first,
          lastName: last,
          email: rData.guestEmail || `${first.toLowerCase()}@email.com`,
          phone: rData.guestPhone || '+971 50 123 4567',
          idType: 'PASSPORT',
          idNumber: `P${984000 + index}`,
          nationality: 'International',
          vipStatus: rData.category === 'SUITE' || enrichment.vipTier === 'PLATINUM' || enrichment.vipTier === 'GOLD',
          vipTier: enrichment.vipTier,
          memberSince: enrichment.memberSince,
          lifetimeSpend: enrichment.lifetimeSpend,
          totalStaysCount: enrichment.totalStaysCount,
          totalNightsCount: enrichment.totalNightsCount,
          roomPreferences: enrichment.roomPreferences,
          pastStays: enrichment.pastStays,
          createdAt: '2025-10-14T10:00:00Z'
        };
        this.guests.set(guestId, guest);

        const bookingId = `bk-${rData.roomNumber}`;
        const folioId = `fol-${rData.roomNumber}`;
        const booking: Booking = {
          id: bookingId,
          bookingReference: rData.resNumber || `#RES-${45870 + index}`,
          roomId,
          guestId,
          checkInDate: '2025-10-14, 02:15 PM',
          checkOutDate: '2025-10-16',
          actualCheckIn: '2025-10-14T14:15:00Z',
          numberOfGuests: 2,
          ratePerNight: rData.price,
          totalNights: 2,
          status: 'CHECKED_IN',
          folioId,
          createdAt: '2025-10-10T12:00:00Z'
        };
        this.bookings.set(bookingId, booking);
        room.currentBookingId = bookingId;

        // Folio
        const folio: GuestFolio = {
          id: folioId,
          bookingId,
          status: 'OPEN',
          items: [
            { id: `fi-${rData.roomNumber}-1`, folioId, category: 'ROOM_CHARGE', description: `Room ${rData.roomNumber} (Night 1)`, amount: rData.price, date: '14 Oct 2025', postedBy: 'FRONT_DESK' },
            { id: `fi-${rData.roomNumber}-2`, folioId, category: 'ROOM_CHARGE', description: `Room ${rData.roomNumber} (Night 2)`, amount: rData.price, date: '15 Oct 2025', postedBy: 'SYSTEM' }
          ],
          payments: [],
          subtotal: rData.price * 2,
          taxAmount: 0,
          totalAmount: rData.price * 2,
          paidAmount: 0,
          balanceDue: rData.price * 2
        };
        this.folios.set(folioId, folio);
      }

      this.rooms.set(roomId, room);
    });

    // Also populate a few rooms for other floors (Floor 4, 3, 2, 1, Basement) to total 120 rooms
    for (let fl = 1; fl <= 4; fl++) {
      for (let num = 1; num <= 24; num++) {
        const roomNum = `${fl}${num < 10 ? '0' + num : num}`;
        const rid = `rm-${roomNum}`;
        const cat = fl === 1 ? 'SUITE' : fl === 2 ? 'DELUXE' : 'STANDARD';
        const st = num % 7 === 0 ? 'DIRTY' : num % 5 === 0 ? 'MAINTENANCE' : num % 2 === 0 ? 'OCCUPIED' : 'AVAILABLE';
        this.rooms.set(rid, {
          id: rid,
          roomNumber: roomNum,
          floor: fl,
          category: cat,
          pricePerNight: cat === 'SUITE' ? 1200 : cat === 'DELUXE' ? 850 : 650,
          status: st,
          maxOccupancy: 2,
          bedConfig: '1 King Bed',
          amenities: ['Wi-Fi', 'Smart TV', 'Rain Shower']
        });
      }
    }

    // 4. Housekeeping Tasks matching bottom table:
    const tasks: HousekeepingTask[] = [
      { id: 'hk-503', roomId: 'rm-503', roomNumber: '503', assignedStaff: 'Maria Santos', taskType: 'STAYOVER_CLEAN', status: 'PENDING', priority: 'HIGH', notes: 'Make up room. Guest requested fresh luxury linens.', updatedAt: '2025-10-14T10:00:00Z' },
      { id: 'hk-509', roomId: 'rm-509', roomNumber: '509', assignedStaff: 'Carlos Gomez', taskType: 'DEPARTURE_CLEAN', status: 'PENDING', priority: 'HIGH', notes: 'Make up room.', updatedAt: '2025-10-14T09:30:00Z' },
      { id: 'hk-516', roomId: 'rm-516', roomNumber: '516', assignedStaff: 'Elena Ramos', taskType: 'DEEP_CLEAN', status: 'PENDING', priority: 'MEDIUM', notes: 'Deep clean steam treatment.', updatedAt: '2025-10-14T11:00:00Z' },
      { id: 'hk-521', roomId: 'rm-521', roomNumber: '521', assignedStaff: 'Supervisor Fatima', taskType: 'INSPECTION', status: 'IN_PROGRESS', priority: 'HIGH', notes: 'Inspection post-maintenance.', updatedAt: '2025-10-14T12:00:00Z' },
      { id: 'hk-415', roomId: 'rm-415', roomNumber: '415', assignedStaff: 'David Zhang', taskType: 'STAYOVER_CLEAN', status: 'COMPLETED', priority: 'MEDIUM', notes: 'Make up room completed.', updatedAt: '2025-10-14T08:45:00Z' }
    ];
    tasks.forEach(t => this.housekeepingTasks.set(t.id, t));

    // 5. Maintenance Tickets
    const mt1: MaintenanceTicket = {
      id: 'mt-506',
      ticketNumber: 'MT-2025-506',
      roomId: 'rm-506',
      roomNumber: '506',
      category: 'HVAC',
      description: 'Climate control system sensor replacement.',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: 'Marcus Vance',
      locksRoom: true,
      createdAt: '2025-10-14T08:00:00Z'
    };
    const mt2: MaintenanceTicket = {
      id: 'mt-521',
      ticketNumber: 'MT-2025-521',
      roomId: 'rm-521',
      roomNumber: '521',
      category: 'PLUMBING',
      description: 'Shower mixer pressure regulation valve.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'Marcus Vance',
      locksRoom: true,
      createdAt: '2025-10-14T09:15:00Z'
    };
    this.maintenanceTickets.set(mt1.id, mt1);
    this.maintenanceTickets.set(mt2.id, mt2);
    this.rooms.get('rm-506')!.activeMaintenanceTicketId = mt1.id;
    this.rooms.get('rm-521')!.activeMaintenanceTicketId = mt2.id;
  }

  checkInGuest(bookingId: string) {
    const booking = this.bookings.get(bookingId);
    if (!booking) throw new Error('Booking not found');
    const room = this.rooms.get(booking.roomId);
    if (!room) throw new Error('Assigned room not found');

    booking.status = 'CHECKED_IN';
    booking.actualCheckIn = new Date().toISOString();
    room.status = 'OCCUPIED';
    room.currentBookingId = booking.id;

    // Auto deduct luxury amenities
    const item = this.inventoryItems.get('inv-3');
    if (item) {
      item.stockByLocation.FLOOR_LINEN_CLOSET = Math.max(0, (item.stockByLocation.FLOOR_LINEN_CLOSET || 0) - 2);
      item.totalStock = Object.values(item.stockByLocation).reduce((a, b) => a + b, 0);
      this.inventoryConsumptionLogs.unshift({
        id: `con-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        roomId: room.id,
        roomNumber: room.roomNumber,
        quantity: 2,
        locationId: 'FLOOR_LINEN_CLOSET',
        trigger: 'CHECK_IN_AUTO_DEDUCT',
        timestamp: new Date().toISOString()
      });
    }

    return { booking, room };
  }

  checkOutGuest(bookingId: string, settlementMethod?: 'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER') {
    const booking = this.bookings.get(bookingId);
    if (!booking) throw new Error('Booking not found');
    const room = this.rooms.get(booking.roomId);
    if (!room) throw new Error('Room not found');

    const folio = this.folios.get(booking.folioId);
    if (folio && folio.balanceDue > 0 && settlementMethod) {
      folio.paidAmount += folio.balanceDue;
      folio.balanceDue = 0;
      folio.status = 'SETTLED';
    }

    booking.status = 'CHECKED_OUT';
    booking.actualCheckOut = new Date().toISOString();
    room.status = 'CHECKED_OUT';
    room.currentBookingId = null;

    return { booking, room, folio };
  }

  postPosCharge(roomNumber: string, category: any, description: string, amount: number, serverName: string) {
    const room = Array.from(this.rooms.values()).find(r => r.roomNumber === roomNumber);
    if (!room) throw new Error(`Room ${roomNumber} does not exist`);
    if (!room.currentBookingId) throw new Error(`Room ${roomNumber} is currently vacant.`);

    const booking = this.bookings.get(room.currentBookingId);
    if (!booking) throw new Error('No active booking found');

    const folio = this.folios.get(booking.folioId);
    if (!folio) throw new Error('Folio not found');

    const newItem = {
      id: `fi-${Date.now()}`,
      folioId: folio.id,
      category,
      description,
      amount,
      date: '14 Oct 2025',
      postedBy: `POS (${serverName})`
    };
    folio.items.push(newItem);
    folio.subtotal += amount;
    folio.totalAmount += amount;
    folio.balanceDue += amount;

    return { folio, newItem };
  }

  transferInventory(itemId: string, fromLoc: WarehouseLocationId, toLoc: WarehouseLocationId, qty: number, reason: string, staffName: string) {
    const item = this.inventoryItems.get(itemId);
    if (!item) throw new Error('Item not found');
    item.stockByLocation[fromLoc] = Math.max(0, (item.stockByLocation[fromLoc] || 0) - qty);
    item.stockByLocation[toLoc] = (item.stockByLocation[toLoc] || 0) + qty;
    item.totalStock = Object.values(item.stockByLocation).reduce((a, b) => a + b, 0);

    const trf: StockTransfer = {
      id: `tr-${Date.now()}`,
      reference: `TRF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      itemId: item.id,
      itemName: item.name,
      fromLocation: fromLoc,
      toLocation: toLoc,
      quantity: qty,
      reason,
      transferredBy: staffName,
      timestamp: new Date().toISOString()
    };
    this.stockTransfers.unshift(trf);
    return { item, transfer: trf };
  }

  transitionPurchaseOrder(poId: string, nextStatus: any, receiveQtyMap?: any) {
    const po = this.purchaseOrders.get(poId);
    if (!po) throw new Error('PO not found');
    po.status = nextStatus;
    return po;
  }
}

export const db = new HotelDatabase();
