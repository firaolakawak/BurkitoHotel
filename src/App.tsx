/**
 * Aurelia Hospitality Cloud - Main Application Shell
 * Upgraded to match exact UI/UX, light theme, dark navy sidebar, and drawer layout.
 */

import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { MetricsBar } from './components/pms/MetricsBar.tsx';
import { RoomGrid } from './components/pms/RoomGrid.tsx';
import { RoomDetailDrawer } from './components/pms/RoomDetailDrawer.tsx';
import { BottomOperationalTables } from './components/pms/BottomOperationalTables.tsx';
import { BookingWizardModal } from './components/pms/BookingWizardModal.tsx';
import { CheckOutModal } from './components/pms/CheckOutModal.tsx';
import { InventoryDashboard } from './components/ims/InventoryDashboard.tsx';
import { InventoryMetricsBar } from './components/ims/InventoryMetricsBar.tsx';
import { InventoryItemDetailDrawer } from './components/ims/InventoryItemDetailDrawer.tsx';
import { StockTransferModal } from './components/ims/StockTransferModal.tsx';
import { PurchaseOrderModal } from './components/ims/PurchaseOrderModal.tsx';
import { StaffManagement } from './components/staff/StaffManagement.tsx';
import { AddStaffModal } from './components/staff/AddStaffModal.tsx';
import { CashierPos } from './components/pos/CashierPos.tsx';
import { HousekeepingBoard } from './components/housekeeping/HousekeepingBoard.tsx';
import { MaintenanceModal } from './components/housekeeping/MaintenanceModal.tsx';
import { FolioInvoiceModal } from './components/billing/FolioInvoiceModal.tsx';
import { ArchitectureViewer } from './components/blueprint/ArchitectureViewerModal.tsx';
import { MenuManagement } from './components/menu/MenuManagement.tsx';
import { RoomManagement } from './components/room/RoomManagement.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    selectedRoom,
    setSelectedRoom,
    selectedInventoryItem,
    setSelectedInventoryItem
  } = useHotel();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* 1. Left Dark Navy Sidebar */}
      <Sidebar />

      {/* 2. Main Content Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <Header />

        {/* Content View Router */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          
          {/* Main Workspace Column */}
          <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto min-w-0">
            {activeTab === 'STAFF' && (
              <StaffManagement />
            )}

            {activeTab === 'MENU_MANAGEMENT' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Menu Management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Food & beverage categories, items, pricing, and availability</p>
                </div>
                <MenuManagement />
              </div>
            )}

            {activeTab === 'ROOM_MANAGEMENT' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Create, update, and manage room details across all floors</p>
                </div>
                <RoomManagement />
              </div>
            )}

            {activeTab === 'PMS_GRID' && (
              <>
                {/* Section Title */}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Front Desk</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Live room status and hotel operations</p>
                </div>

                {/* 7 KPI Metric Cards */}
                <MetricsBar />

                {/* Sub-tabs, Floor selector & 6-column Room Grid */}
                <RoomGrid />

                {/* Bottom 3 Operational Panels: Arrivals, Departures, Housekeeping */}
                <BottomOperationalTables />
              </>
            )}

            {activeTab === 'INVENTORY' && (
              <>
                {/* Section Title */}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Supply Chain (IMS)</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time multi-location warehouse stock, automated reorders & procurement lifecycle</p>
                </div>

                {/* 7 KPI Metric Cards matching Aurelia PMS */}
                <InventoryMetricsBar />

                {/* Catalog, Multi-Warehouse Matrix, POs & Deductions */}
                <InventoryDashboard />
              </>
            )}

            {activeTab === 'POS' && (
              <CashierPos />
            )}

            {activeTab === 'HOUSEKEEPING' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Housekeeping & Maintenance</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Room turnaround queues and priority room lockout tickets</p>
                </div>
                <HousekeepingBoard />
              </div>
            )}

            {activeTab === 'BLUEPRINT' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Schema & System Architecture</h1>
                  <p className="text-xs text-slate-500 mt-0.5">PostgreSQL DDL, Prisma relational schema, and ER diagrams</p>
                </div>
                <ArchitectureViewer />
              </div>
            )}
          </div>

          {/* 3. Right-Hand Room Detail Drawer (Displayed on Front Desk view) */}
          {activeTab === 'PMS_GRID' && selectedRoom && (
            <RoomDetailDrawer
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
            />
          )}

          {/* 4. Right-Hand Inventory Detail Drawer (Displayed on Inventory view) */}
          {activeTab === 'INVENTORY' && selectedInventoryItem && (
            <InventoryItemDetailDrawer
              item={selectedInventoryItem}
              onClose={() => setSelectedInventoryItem(null)}
            />
          )}

        </div>
      </div>

      {/* Global Modals */}
      <BookingWizardModal />
      <CheckOutModal />
      <StockTransferModal />
      <PurchaseOrderModal />
      <MaintenanceModal />
      <FolioInvoiceModal />
      <AddStaffModal />

      {/* Floating Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainLayout />
    </HotelProvider>
  );
}
