/**
 * Architectural Overview & System Blueprints
 * Explaining system boundaries, data flow, synchronization between PMS and IMS,
 * and complete folder structure for frontend and backend.
 */

export const ARCHITECTURE_OVERVIEW = {
  title: "GrandHorizon Hotel Management System & Integrated IMS Architecture",
  version: "2.4.0",
  folderStructure: `
grandhorizon-hms-ims/
├── server.ts                  # Express backend entry point + Vite dev server middleware
├── package.json               # Full-stack dependencies & scripts
├── tsconfig.json              # Strict TypeScript compiler options
├── vite.config.ts             # Bundler, React plugin & Tailwind integration
├── index.html                 # HTML shell with meta tags & Google fonts
├── src/
│   ├── main.tsx               # Client React 19 entry point
│   ├── App.tsx                # Main application hub with navigation & routing
│   ├── index.css              # Tailwind CSS styles & design tokens
│   ├── types/
│   │   └── index.ts           # Central TypeScript interfaces (Rooms, Bookings, IMS, POS, etc.)
│   ├── schema/
│   │   ├── prisma.schema.ts   # Prisma ORM relational schema
│   │   ├── postgres.ddl.ts    # Raw PostgreSQL DDL with triggers & indexes
│   │   └── architecture.ts    # System architecture blueprint & design documentation
│   ├── server/                # Backend API implementation
│   │   ├── database.ts        # Relational in-memory transactional store & seed dataset
│   │   └── routes/
│   │       ├── rooms.ts       # Room grid, status transitions, availability endpoints
│   │       ├── bookings.ts    # Reservation workflow, check-in, check-out, auto-inventory consumption
│   │       ├── inventory.ts   # Multi-location inventory, transfers, safety alerts, PO lifecycle
│   │       ├── pos.ts         # Room service/Spa POS terminal & direct folio posting
│   │       └── housekeeping.ts# Housekeeping queues & Maintenance ticketing
│   ├── services/
│   │   └── api.ts             # Robust client API service with instant response & fallback
│   ├── context/
│   │   └── HotelContext.tsx   # React Context state provider & custom hooks
│   └── components/
│       ├── Header.tsx         # Executive KPI summary bar (Occupancy, RevPAR, Alerts)
│       ├── pms/
│       │   ├── RoomGrid.tsx           # Floor plan visual matrix with real-time status badges
│       │   ├── RoomDetailModal.tsx    # Detailed room drawer, amenities, current folio
│       │   ├── BookingWizardModal.tsx # Multi-step booking & guest registration wizard
│       │   └── CheckOutModal.tsx      # Settle folio, charge card/cash, release room to dirty
│       ├── ims/
│       │   ├── InventoryDashboard.tsx # Stock catalog, low-stock alerts, filter by warehouse
│       │   ├── StockTransferModal.tsx # Multi-location transfer wizard (Warehouse <-> Closets)
│       │   └── PurchaseOrderModal.tsx # PO creator & lifecycle state transitions
│       ├── pos/
│       │   └── PosTerminal.tsx        # Restaurant/Room Service POS & direct room billing
│       ├── housekeeping/
│       │   ├── HousekeepingBoard.tsx  # Mobile-responsive room turnaround dispatch
│       │   └── MaintenanceModal.tsx   # Lock room, report HVAC/plumbing issue, assign tech
│       ├── billing/
│       │   └── FolioInvoiceModal.tsx  # Printable itemized guest invoice & receipt
│       └── blueprint/
│           └── ArchitectureViewerModal.tsx # Live schema & architecture documentation viewer
`,
  keyIntegrations: [
    {
      module: "PMS <-> IMS Check-In Automation",
      mechanism: "Event-driven inventory deduction",
      description: "When a guest is checked into a room (e.g. Deluxe Suite), the system automatically triggers a deduction from the Floor Linen Closet or Main Warehouse for assigned complimentary kits (Premium Toiletries Set, Bottled Spring Water, Deluxe Linen Pack). This prevents inventory discrepancies without manual counting."
    },
    {
      module: "POS <-> Guest Folio Integration",
      mechanism: "Real-time room room ledger posting",
      description: "Restaurant, Bar, Room Service, and Spa terminals post charges directly to the guest's open folio via room number verification. Charges are recorded with timestamp, operator ID, and category breakdown for unified checkout."
    },
    {
      module: "Maintenance <-> Room Inventory Locking",
      mechanism: "Automated availability restriction",
      description: "When a critical maintenance ticket is created (e.g. HVAC failure or water leak), the room status is instantly transitioned to 'MAINTENANCE'. The room is blocked from the booking engine and room grid until the technician marks the ticket resolved."
    },
    {
      module: "Multi-Location Warehouse Tracking",
      mechanism: "Hierarchical stock management",
      description: "Supplies arrive at the Main Warehouse via Purchase Orders. Departmental units (Floor Linen Closets and Kitchen Pantry) request stock transfers through a logged internal transfer workflow with full audit trails."
    }
  ]
};
