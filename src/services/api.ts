/**
 * Unified API Client for GrandHorizon HMS & IMS
 * Interfaces with Express REST backend with resilient error handling and response unwrapping.
 */

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
  WarehouseLocationId
} from '../types/index.ts';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const apiService = {
  // Rooms
  getRooms: async (params?: { floor?: number; status?: string; category?: string }): Promise<Room[]> => {
    const searchParams = new URLSearchParams();
    if (params?.floor) searchParams.set('floor', String(params.floor));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    return request<Room[]>(`/api/rooms?${searchParams.toString()}`);
  },

  getRoomDetails: async (id: string) => {
    return request<{
      room: Room;
      booking?: Booking;
      guest?: any;
      folio?: GuestFolio;
    }>(`/api/rooms/${id}`);
  },

  updateRoomStatus: async (id: string, status: string) => {
    return request<Room>(`/api/rooms/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Bookings
  getBookings: async (status?: string): Promise<Booking[]> => {
    const searchParams = status ? `?status=${status}` : '';
    return request<Booking[]>(`/api/bookings${searchParams}`);
  },

  createBooking: async (data: {
    guestData: any;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    specialRequests?: string;
    autoCheckIn?: boolean;
  }) => {
    return request<{ booking: Booking; folio: GuestFolio }>(`/api/bookings`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  checkInGuest: async (bookingId: string) => {
    return request<{ booking: Booking; room: Room }>(`/api/bookings/${bookingId}/check-in`, {
      method: 'POST'
    });
  },

  checkOutGuest: async (bookingId: string, paymentMethod?: string) => {
    return request<{ booking: Booking; room: Room; folio: GuestFolio }>(`/api/bookings/${bookingId}/check-out`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod: paymentMethod || 'CREDIT_CARD' })
    });
  },

  getFolio: async (bookingId: string) => {
    return request<{
      folio: GuestFolio;
      booking: Booking;
      guest: any;
      room: Room;
    }>(`/api/bookings/${bookingId}/folio`);
  },

  // Inventory & Warehouse
  getInventoryItems: async (params?: { category?: string; lowStockOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.lowStockOnly) searchParams.set('lowStockOnly', 'true');
    return request<InventoryItem[]>(`/api/inventory/items?${searchParams.toString()}`);
  },

  createInventoryItem: async (itemData: any) => {
    return request<InventoryItem>(`/api/inventory/items`, {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  transferStock: async (transferData: {
    itemId: string;
    fromLocation: WarehouseLocationId;
    toLocation: WarehouseLocationId;
    quantity: number;
    reason: string;
    staffName: string;
  }) => {
    return request<{ item: InventoryItem; transfer: StockTransfer }>(`/api/inventory/transfers`, {
      method: 'POST',
      body: JSON.stringify(transferData)
    });
  },

  getWarehouseLocations: async () => {
    return request<WarehouseLocation[]>(`/api/inventory/locations`);
  },

  getStockTransfers: async () => {
    return request<StockTransfer[]>(`/api/inventory/transfers`);
  },

  getConsumptionLogs: async () => {
    return request<any[]>(`/api/inventory/consumption-logs`);
  },

  getPurchaseOrders: async () => {
    return request<PurchaseOrder[]>(`/api/inventory/purchase-orders`);
  },

  createPurchaseOrder: async (data: any) => {
    return request<PurchaseOrder>(`/api/inventory/purchase-orders`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updatePurchaseOrderStatus: async (poId: string, status: string, receiveQtyMap?: Record<string, number>) => {
    return request<PurchaseOrder>(`/api/inventory/purchase-orders/${poId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, receiveQtyMap })
    });
  },

  // POS
  getPosProducts: async () => {
    return request<PosProduct[]>(`/api/pos/products`);
  },

  postPosCharge: async (data: {
    roomNumber: string;
    category: 'FOOD_BEVERAGE' | 'MINIBAR' | 'SPA';
    description: string;
    amount: number;
    serverName: string;
  }) => {
    return request<{ folio: GuestFolio; newItem: any }>(`/api/pos/charge-room`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Housekeeping & Maintenance
  getHousekeepingTasks: async () => {
    return request<HousekeepingTask[]>(`/api/housekeeping/tasks`);
  },

  updateHousekeepingTask: async (id: string, status: string, notes?: string) => {
    return request<HousekeepingTask>(`/api/housekeeping/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  getMaintenanceTickets: async () => {
    return request<MaintenanceTicket[]>(`/api/housekeeping/maintenance`);
  },

  createMaintenanceTicket: async (ticketData: any) => {
    return request<MaintenanceTicket>(`/api/housekeeping/maintenance`, {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },

  resolveMaintenanceTicket: async (id: string) => {
    return request<MaintenanceTicket>(`/api/housekeeping/maintenance/${id}/resolve`, {
      method: 'PATCH'
    });
  }
};
