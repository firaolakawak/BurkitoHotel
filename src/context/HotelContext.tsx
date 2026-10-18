/**
 * Global Hotel & Inventory Management System Context
 * Provides real-time synchronization, toast alerts, and action triggers across PMS & IMS.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Room,
  Booking,
  GuestFolio,
  InventoryItem,
  WarehouseLocation,
  StockTransfer,
  PurchaseOrder,
  HousekeepingTask,
  MaintenanceTicket,
  PosProduct,
  WarehouseLocationId,
  Employee,
  StaffStatus
} from '../types/index.ts';
import { INITIAL_STAFF } from '../data/staffData.ts';
import { apiService } from '../services/api.ts';
import { db } from '../server/database.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface HotelContextType {
  // Data state
  rooms: Room[];
  bookings: Booking[];
  inventoryItems: InventoryItem[];
  warehouseLocations: WarehouseLocation[];
  stockTransfers: StockTransfer[];
  purchaseOrders: PurchaseOrder[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceTickets: MaintenanceTicket[];
  posProducts: PosProduct[];
  consumptionLogs: any[];
  isLoading: boolean;
  toasts: ToastMessage[];

  // Metrics
  metrics: {
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    dirtyRooms: number;
    maintenanceRooms: number;
    availableRooms: number;
    revPar: number;
    adr: number;
    lowStockCount: number;
    openMaintenanceCount: number;
    pendingHousekeepingCount: number;
    totalInventoryValue: number;
  };

  // Modals & Active Selections
  activeTab: 'PMS_GRID' | 'INVENTORY' | 'POS' | 'HOUSEKEEPING' | 'BLUEPRINT' | 'STAFF';
  setActiveTab: (tab: 'PMS_GRID' | 'INVENTORY' | 'POS' | 'HOUSEKEEPING' | 'BLUEPRINT' | 'STAFF') => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  selectedInventoryItem: InventoryItem | null;
  setSelectedInventoryItem: (item: InventoryItem | null) => void;
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isAddStaffOpen: boolean;
  setIsAddStaffOpen: (open: boolean) => void;
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployeeStatus: (id: string, status: StaffStatus) => void;
  isBookingWizardOpen: boolean;
  setIsBookingWizardOpen: (open: boolean) => void;
  bookingWizardInitialRoomId?: string | null;
  openBookingWizardForRoom: (roomId?: string) => void;
  isCheckOutModalOpen: boolean;
  setIsCheckOutModalOpen: (open: boolean) => void;
  checkOutBooking: Booking | null;
  openCheckOutModal: (booking: Booking) => void;
  isStockTransferOpen: boolean;
  setIsStockTransferOpen: (open: boolean) => void;
  stockTransferItem: InventoryItem | null;
  openStockTransferModal: (item?: InventoryItem) => void;
  isPurchaseOrderOpen: boolean;
  setIsPurchaseOrderOpen: (open: boolean) => void;
  isMaintenanceModalOpen: boolean;
  setIsMaintenanceModalOpen: (open: boolean) => void;
  maintenanceRoom: Room | null;
  openMaintenanceModal: (room?: Room) => void;
  isFolioModalOpen: boolean;
  setIsFolioModalOpen: (open: boolean) => void;
  folioModalBooking: Booking | null;
  openFolioModal: (booking: Booking) => void;

  // Actions
  refreshAllData: () => Promise<void>;
  createBooking: (payload: any) => Promise<boolean>;
  checkInGuest: (bookingId: string) => Promise<boolean>;
  checkOutGuest: (bookingId: string, paymentMethod?: string) => Promise<boolean>;
  transferStock: (payload: {
    itemId: string;
    fromLocation: WarehouseLocationId;
    toLocation: WarehouseLocationId;
    quantity: number;
    reason: string;
    staffName: string;
  }) => Promise<boolean>;
  postPosCharge: (payload: {
    roomNumber: string;
    category: 'FOOD_BEVERAGE' | 'MINIBAR' | 'SPA';
    description: string;
    amount: number;
    serverName: string;
  }) => Promise<boolean>;
  updateHousekeepingTask: (id: string, status: string, notes?: string) => Promise<boolean>;
  createMaintenanceTicket: (payload: any) => Promise<boolean>;
  resolveMaintenanceTicket: (id: string) => Promise<boolean>;
  createPurchaseOrder: (payload: any) => Promise<boolean>;
  transitionPOStatus: (poId: string, status: string, receiveQtyMap?: Record<string, number>) => Promise<boolean>;
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [warehouseLocations, setWarehouseLocations] = useState<WarehouseLocation[]>([]);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [posProducts, setPosProducts] = useState<PosProduct[]>([]);
  const [consumptionLogs, setConsumptionLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'PMS_GRID' | 'INVENTORY' | 'POS' | 'HOUSEKEEPING' | 'BLUEPRINT' | 'STAFF'>('STAFF');

  // Staff State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_STAFF);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(INITIAL_STAFF[0]);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // Modals state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState(false);
  const [bookingWizardInitialRoomId, setBookingWizardInitialRoomId] = useState<string | null>(null);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [isStockTransferOpen, setIsStockTransferOpen] = useState(false);
  const [stockTransferItem, setStockTransferItem] = useState<InventoryItem | null>(null);
  const [isPurchaseOrderOpen, setIsPurchaseOrderOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceRoom, setMaintenanceRoom] = useState<Room | null>(null);
  const [isFolioModalOpen, setIsFolioModalOpen] = useState(false);
  const [folioModalBooking, setFolioModalBooking] = useState<Booking | null>(null);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addEmployee = useCallback((empData: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: empData.name || 'New Staff',
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: empData.department || 'Front Office',
      position: empData.position || 'Staff Associate',
      status: empData.status || 'Active',
      workType: empData.workType || 'Full Time',
      phone: empData.phone || '+971 50 000 0000',
      email: empData.email || 'staff@hotel.com',
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tenure: 'Just Joined',
      managerName: empData.managerName || 'Sarah Khan',
      managerPosition: empData.managerPosition || 'Hotel Manager',
      managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      shift: empData.shift || 'Morning (07:00 - 15:30)',
      todayAttendance: { status: 'Checked In', time: '08:00 AM' },
      activities: [
        { id: `act-${Date.now()}`, type: 'checkin', title: 'Onboarded & Profile Created', time: 'Today' }
      ]
    };
    setEmployees(prev => [newEmp, ...prev]);
    setSelectedEmployee(newEmp);
    addToast({
      type: 'success',
      title: 'Staff Member Registered',
      message: `${newEmp.name} registered as ${newEmp.position} in ${newEmp.department}.`
    });
  }, [employees.length, addToast]);

  const updateEmployeeStatus = useCallback((id: string, status: StaffStatus) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setSelectedEmployee(prev => prev && prev.id === id ? { ...prev, status } : prev);
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Employee status changed to ${status}.`
    });
  }, [addToast]);

  // Sync / Refresh function with fallback to database directly
  const refreshAllData = useCallback(async () => {
    try {
      // First try fetching from Express backend
      const [
        fetchedRooms,
        fetchedBookings,
        fetchedItems,
        fetchedLocations,
        fetchedTransfers,
        fetchedPOs,
        fetchedTasks,
        fetchedTickets,
        fetchedPOS,
        fetchedLogs
      ] = await Promise.all([
        apiService.getRooms().catch(() => Array.from(db.rooms.values())),
        apiService.getBookings().catch(() => Array.from(db.bookings.values()).map(b => ({
          ...b,
          guest: db.guests.get(b.guestId),
          room: db.rooms.get(b.roomId),
          folio: db.folios.get(b.folioId)
        }))),
        apiService.getInventoryItems().catch(() => Array.from(db.inventoryItems.values())),
        apiService.getWarehouseLocations().catch(() => Array.from(db.warehouseLocations.values())),
        apiService.getStockTransfers().catch(() => db.stockTransfers),
        apiService.getPurchaseOrders().catch(() => Array.from(db.purchaseOrders.values())),
        apiService.getHousekeepingTasks().catch(() => Array.from(db.housekeepingTasks.values())),
        apiService.getMaintenanceTickets().catch(() => Array.from(db.maintenanceTickets.values())),
        apiService.getPosProducts().catch(() => db.posProducts),
        apiService.getConsumptionLogs().catch(() => db.inventoryConsumptionLogs)
      ]);

      setRooms(fetchedRooms);
      setSelectedRoom(prev => prev || fetchedRooms.find(r => r.roomNumber === '502') || fetchedRooms[0] || null);
      setBookings(fetchedBookings);
      setInventoryItems(fetchedItems);
      setWarehouseLocations(fetchedLocations);
      setStockTransfers(fetchedTransfers);
      setPurchaseOrders(fetchedPOs);
      setHousekeepingTasks(fetchedTasks);
      setMaintenanceTickets(fetchedTickets);
      setPosProducts(fetchedPOS);
      setConsumptionLogs(fetchedLogs);
    } catch (err: any) {
      console.warn('Network sync notice: Using synchronized in-memory database store.', err);
      setRooms(Array.from(db.rooms.values()));
      setBookings(Array.from(db.bookings.values()));
      setInventoryItems(Array.from(db.inventoryItems.values()));
      setWarehouseLocations(Array.from(db.warehouseLocations.values()));
      setStockTransfers(db.stockTransfers);
      setPurchaseOrders(Array.from(db.purchaseOrders.values()));
      setHousekeepingTasks(Array.from(db.housekeepingTasks.values()));
      setMaintenanceTickets(Array.from(db.maintenanceTickets.values()));
      setPosProducts(db.posProducts);
      setConsumptionLogs(db.inventoryConsumptionLogs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Derived KPIs
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
  const dirtyRooms = rooms.filter(r => r.status === 'DIRTY' || r.status === 'CHECKED_OUT').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE').length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  // Calculate ADR & RevPAR
  const occupiedRoomEntities = rooms.filter(r => r.status === 'OCCUPIED');
  const totalOccupiedRate = occupiedRoomEntities.reduce((sum, r) => sum + r.pricePerNight, 0);
  const adr = occupiedRooms > 0 ? Math.round(totalOccupiedRate / occupiedRooms) : 0;
  const revPar = totalRooms > 0 ? Math.round(totalOccupiedRate / totalRooms) : 0;

  const lowStockCount = inventoryItems.filter(i => i.totalStock <= i.minSafetyStock).length;
  const openMaintenanceCount = maintenanceTickets.filter(t => t.status !== 'RESOLVED').length;
  const pendingHousekeepingCount = housekeepingTasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const totalInventoryValue = Number(inventoryItems.reduce((sum, i) => sum + (i.totalStock * i.unitCost), 0).toFixed(2));

  // Modal Triggers
  const openBookingWizardForRoom = (roomId?: string) => {
    setBookingWizardInitialRoomId(roomId || null);
    setIsBookingWizardOpen(true);
  };

  const openCheckOutModal = (booking: Booking) => {
    setCheckOutBooking(booking);
    setIsCheckOutModalOpen(true);
  };

  const openStockTransferModal = (item?: InventoryItem) => {
    setStockTransferItem(item || null);
    setIsStockTransferOpen(true);
  };

  const openMaintenanceModal = (room?: Room) => {
    setMaintenanceRoom(room || null);
    setIsMaintenanceModalOpen(true);
  };

  const openFolioModal = (booking: Booking) => {
    setFolioModalBooking(booking);
    setIsFolioModalOpen(true);
  };

  // -------------------------------------------------------------
  // ACTIONS WRAPPERS
  // -------------------------------------------------------------

  const handleCreateBooking = async (payload: any): Promise<boolean> => {
    try {
      try {
        await apiService.createBooking(payload);
      } catch {
        // Direct DB fallback
        const room = db.rooms.get(payload.roomId);
        if (!room) throw new Error('Room not found');
        const guest = {
          id: `g-${Date.now()}`,
          firstName: payload.guestData.firstName,
          lastName: payload.guestData.lastName,
          email: payload.guestData.email,
          phone: payload.guestData.phone,
          idType: payload.guestData.idType || 'PASSPORT',
          idNumber: payload.guestData.idNumber,
          nationality: payload.guestData.nationality || 'Unknown',
          vipStatus: !!payload.guestData.vipStatus,
          createdAt: new Date().toISOString()
        };
        db.guests.set(guest.id, guest);

        const nights = 2;
        const total = room.pricePerNight * nights;
        const bookingId = `bk-${Date.now()}`;
        const folioId = `fol-${Date.now()}`;

        const folio: GuestFolio = {
          id: folioId,
          bookingId,
          status: 'OPEN',
          items: [
            { id: `fi-${Date.now()}-1`, folioId, category: 'ROOM_CHARGE', description: `Room ${room.roomNumber} - ${nights} Nights`, amount: total, date: payload.checkInDate, postedBy: 'FRONT_DESK' },
            { id: `fi-${Date.now()}-2`, folioId, category: 'TAX', description: 'Occupancy Tax (12%)', amount: total * 0.12, date: payload.checkInDate, postedBy: 'SYSTEM' }
          ],
          payments: [],
          subtotal: total,
          taxAmount: total * 0.12,
          totalAmount: total * 1.12,
          paidAmount: 0,
          balanceDue: total * 1.12
        };
        db.folios.set(folioId, folio);

        const booking: Booking = {
          id: bookingId,
          bookingReference: `GH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          roomId: room.id,
          guestId: guest.id,
          checkInDate: payload.checkInDate,
          checkOutDate: payload.checkOutDate,
          numberOfGuests: payload.numberOfGuests || 1,
          ratePerNight: room.pricePerNight,
          totalNights: nights,
          status: payload.autoCheckIn ? 'CHECKED_IN' : 'CONFIRMED',
          folioId,
          createdAt: new Date().toISOString()
        };
        db.bookings.set(bookingId, booking);

        if (payload.autoCheckIn) {
          db.checkInGuest(bookingId);
        }
      }

      addToast({
        type: 'success',
        title: 'Booking Confirmed',
        message: payload.autoCheckIn
          ? `Guest registered & checked in! Inventory supplies auto-deducted.`
          : `Reservation confirmed successfully.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Reservation Failed', message: err.message });
      return false;
    }
  };

  const handleCheckInGuest = async (bookingId: string): Promise<boolean> => {
    try {
      try {
        await apiService.checkInGuest(bookingId);
      } catch {
        db.checkInGuest(bookingId);
      }
      addToast({
        type: 'success',
        title: 'Guest Checked In',
        message: 'Room marked Occupied. Luxury amenities kit automatically deducted from floor inventory!'
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Check-In Error', message: err.message });
      return false;
    }
  };

  const handleCheckOutGuest = async (bookingId: string, paymentMethod?: string): Promise<boolean> => {
    try {
      try {
        await apiService.checkOutGuest(bookingId, paymentMethod);
      } catch {
        db.checkOutGuest(bookingId, (paymentMethod as any) || 'CREDIT_CARD');
      }
      addToast({
        type: 'success',
        title: 'Check-Out Finalized',
        message: 'Folio settled. Room transitioned to DIRTY and routed to Housekeeping dispatch.'
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Check-Out Error', message: err.message });
      return false;
    }
  };

  const handleTransferStock = async (payload: {
    itemId: string;
    fromLocation: WarehouseLocationId;
    toLocation: WarehouseLocationId;
    quantity: number;
    reason: string;
    staffName: string;
  }): Promise<boolean> => {
    try {
      try {
        await apiService.transferStock(payload);
      } catch {
        db.transferInventory(payload.itemId, payload.fromLocation, payload.toLocation, payload.quantity, payload.reason, payload.staffName);
      }
      addToast({
        type: 'success',
        title: 'Stock Transferred',
        message: `Successfully moved ${payload.quantity} units to ${payload.toLocation}.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Transfer Failed', message: err.message });
      return false;
    }
  };

  const handlePostPosCharge = async (payload: {
    roomNumber: string;
    category: 'FOOD_BEVERAGE' | 'MINIBAR' | 'SPA';
    description: string;
    amount: number;
    serverName: string;
  }): Promise<boolean> => {
    try {
      try {
        await apiService.postPosCharge(payload);
      } catch {
        db.postPosCharge(payload.roomNumber, payload.category, payload.description, payload.amount, payload.serverName);
      }
      addToast({
        type: 'success',
        title: 'Charge Posted to Room',
        message: `$${payload.amount.toFixed(2)} posted directly to Room ${payload.roomNumber} folio.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Charge Posting Failed', message: err.message });
      return false;
    }
  };

  const handleUpdateHousekeepingTask = async (id: string, status: string, notes?: string): Promise<boolean> => {
    try {
      try {
        await apiService.updateHousekeepingTask(id, status, notes);
      } catch {
        const task = db.housekeepingTasks.get(id);
        if (task) {
          task.status = status as any;
          if (notes) task.notes = notes;
          if (status === 'COMPLETED' || status === 'INSPECTED') {
            const rm = db.rooms.get(task.roomId);
            if (rm && rm.status === 'DIRTY') rm.status = 'AVAILABLE';
          }
        }
      }
      addToast({
        type: 'success',
        title: 'Housekeeping Updated',
        message: `Task marked as ${status}. Room inventory status updated.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
      return false;
    }
  };

  const handleCreateMaintenanceTicket = async (payload: any): Promise<boolean> => {
    try {
      try {
        await apiService.createMaintenanceTicket(payload);
      } catch {
        const room = db.rooms.get(payload.roomId);
        if (!room) throw new Error('Room not found');
        const tid = `mt-${Date.now()}`;
        const newTicket: MaintenanceTicket = {
          id: tid,
          ticketNumber: `MT-2026-${Math.floor(100 + Math.random() * 900)}`,
          roomId: room.id,
          roomNumber: room.roomNumber,
          category: payload.category || 'HVAC',
          description: payload.description,
          priority: payload.priority || 'HIGH',
          status: 'OPEN',
          assignedTo: payload.assignedTo || 'Maintenance Tech',
          locksRoom: payload.locksRoom !== false,
          createdAt: new Date().toISOString()
        };
        db.maintenanceTickets.set(tid, newTicket);
        if (newTicket.locksRoom) {
          room.status = 'MAINTENANCE';
          room.activeMaintenanceTicketId = tid;
        }
      }
      addToast({
        type: 'warning',
        title: 'Maintenance Ticket Logged',
        message: payload.locksRoom !== false ? `Room locked into MAINTENANCE status.` : `Ticket created.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Ticket Creation Failed', message: err.message });
      return false;
    }
  };

  const handleResolveMaintenanceTicket = async (id: string): Promise<boolean> => {
    try {
      try {
        await apiService.resolveMaintenanceTicket(id);
      } catch {
        const ticket = db.maintenanceTickets.get(id);
        if (ticket) {
          ticket.status = 'RESOLVED';
          const room = db.rooms.get(ticket.roomId);
          if (room && room.status === 'MAINTENANCE') {
            room.status = 'AVAILABLE';
            room.activeMaintenanceTicketId = null;
          }
        }
      }
      addToast({
        type: 'success',
        title: 'Ticket Resolved',
        message: 'Maintenance cleared. Room restored to AVAILABLE in the PMS inventory grid.'
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'Resolution Failed', message: err.message });
      return false;
    }
  };

  const handleCreatePurchaseOrder = async (payload: any): Promise<boolean> => {
    try {
      try {
        await apiService.createPurchaseOrder(payload);
      } catch {
        const poId = `po-${Date.now()}`;
        const newPO: PurchaseOrder = {
          id: poId,
          poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
          vendorId: `v-${Date.now()}`,
          vendorName: payload.vendorName,
          status: 'DRAFT',
          items: payload.items || [],
          totalAmount: payload.totalAmount || 0,
          targetWarehouse: payload.targetWarehouse || 'MAIN_WAREHOUSE',
          createdAt: new Date().toISOString(),
          expectedDeliveryDate: payload.expectedDeliveryDate || '2026-10-25'
        };
        db.purchaseOrders.set(poId, newPO);
      }
      addToast({
        type: 'success',
        title: 'Purchase Order Drafted',
        message: 'New PO registered. Ready to send to vendor.'
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'PO Error', message: err.message });
      return false;
    }
  };

  const handleTransitionPOStatus = async (poId: string, status: string, receiveQtyMap?: Record<string, number>): Promise<boolean> => {
    try {
      try {
        await apiService.updatePurchaseOrderStatus(poId, status, receiveQtyMap);
      } catch {
        db.transitionPurchaseOrder(poId, status as any, receiveQtyMap);
      }
      addToast({
        type: 'success',
        title: 'PO Status Updated',
        message: status === 'FULFILLED' || status === 'PARTIALLY_RECEIVED'
          ? 'Stock automatically restocked into Main Central Warehouse!'
          : `PO status updated to ${status}.`
      });
      await refreshAllData();
      return true;
    } catch (err: any) {
      addToast({ type: 'error', title: 'PO Status Failed', message: err.message });
      return false;
    }
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        inventoryItems,
        warehouseLocations,
        stockTransfers,
        purchaseOrders,
        housekeepingTasks,
        maintenanceTickets,
        posProducts,
        consumptionLogs,
        isLoading,
        toasts,
        metrics: {
          totalRooms,
          occupiedRooms,
          occupancyRate,
          dirtyRooms,
          maintenanceRooms,
          availableRooms,
          revPar,
          adr,
          lowStockCount,
          openMaintenanceCount,
          pendingHousekeepingCount,
          totalInventoryValue
        },
        activeTab,
        setActiveTab,
        selectedRoom,
        setSelectedRoom,
        selectedInventoryItem,
        setSelectedInventoryItem,
        employees,
        selectedEmployee,
        setSelectedEmployee,
        isAddStaffOpen,
        setIsAddStaffOpen,
        addEmployee,
        updateEmployeeStatus,
        isBookingWizardOpen,
        setIsBookingWizardOpen,
        bookingWizardInitialRoomId,
        openBookingWizardForRoom,
        isCheckOutModalOpen,
        setIsCheckOutModalOpen,
        checkOutBooking,
        openCheckOutModal,
        isStockTransferOpen,
        setIsStockTransferOpen,
        stockTransferItem,
        openStockTransferModal,
        isPurchaseOrderOpen,
        setIsPurchaseOrderOpen,
        isMaintenanceModalOpen,
        setIsMaintenanceModalOpen,
        maintenanceRoom,
        openMaintenanceModal,
        isFolioModalOpen,
        setIsFolioModalOpen,
        folioModalBooking,
        openFolioModal,
        refreshAllData,
        createBooking: handleCreateBooking,
        checkInGuest: handleCheckInGuest,
        checkOutGuest: handleCheckOutGuest,
        transferStock: handleTransferStock,
        postPosCharge: handlePostPosCharge,
        updateHousekeepingTask: handleUpdateHousekeepingTask,
        createMaintenanceTicket: handleCreateMaintenanceTicket,
        resolveMaintenanceTicket: handleResolveMaintenanceTicket,
        createPurchaseOrder: handleCreatePurchaseOrder,
        transitionPOStatus: handleTransitionPOStatus,
        addToast,
        removeToast
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
