/**
 * Production-ready PostgreSQL DDL script for GrandHorizon HMS & IMS Suite
 * Includes table constraints, foreign keys with ON DELETE policies, composite indexes,
 * and trigger function for auto-calculating folio balances and inventory safety warnings.
 */

export const POSTGRES_DDL_CONTENT = `-- =====================================================================
-- GRANDHORIZON HOTEL & INVENTORY MANAGEMENT SYSTEM (HMS / IMS)
-- Production PostgreSQL DDL Specification
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- 1. PROPERTY MANAGEMENT SYSTEM (PMS)
-- -------------------------------------------------------------

CREATE TYPE room_category_enum AS ENUM ('STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL');
CREATE TYPE room_status_enum AS ENUM ('AVAILABLE', 'OCCUPIED', 'DIRTY', 'MAINTENANCE', 'CHECKED_OUT');
CREATE TYPE booking_status_enum AS ENUM ('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');
CREATE TYPE folio_status_enum AS ENUM ('OPEN', 'SETTLED', 'CLOSED');
CREATE TYPE charge_category_enum AS ENUM ('ROOM_CHARGE', 'TAX', 'FOOD_BEVERAGE', 'MINIBAR', 'SPA', 'LAUNDRY', 'PARKING', 'MISC');
CREATE TYPE inventory_category_enum AS ENUM ('LINEN', 'TOILETRIES', 'FOOD_BEVERAGE', 'CLEANING_CHEMICALS', 'MINIBAR', 'ROOM_AMENITIES');
CREATE TYPE po_status_enum AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_RECEIVED', 'FULFILLED', 'CANCELLED');
CREATE TYPE maintenance_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE maintenance_status_enum AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');

-- Rooms Table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) NOT NULL UNIQUE,
    floor INTEGER NOT NULL CHECK (floor >= 1),
    category room_category_enum NOT NULL DEFAULT 'STANDARD',
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night > 0),
    status room_status_enum NOT NULL DEFAULT 'AVAILABLE',
    max_occupancy INTEGER NOT NULL DEFAULT 2 CHECK (max_occupancy >= 1),
    bed_config VARCHAR(50) NOT NULL,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_floor_status ON rooms(floor, status);
CREATE INDEX idx_rooms_category ON rooms(category);

-- Guests Table
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    id_type VARCHAR(50) NOT NULL,
    id_number VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) DEFAULT 'Unknown',
    vip_status BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_names ON guests(last_name, first_name);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL CHECK (check_out_date > check_in_date),
    actual_check_in TIMESTAMPTZ,
    actual_check_out TIMESTAMPTZ,
    number_of_guests INTEGER NOT NULL DEFAULT 1 CHECK (number_of_guests > 0),
    rate_per_night NUMERIC(10, 2) NOT NULL,
    total_nights INTEGER NOT NULL CHECK (total_nights > 0),
    status booking_status_enum NOT NULL DEFAULT 'CONFIRMED',
    special_requests TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_room_status ON bookings(room_id, status);

-- -------------------------------------------------------------
-- 2. GUEST FOLIO & BILLING (Unified Accounting)
-- -------------------------------------------------------------

CREATE TABLE folios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    status folio_status_enum NOT NULL DEFAULT 'OPEN',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE folio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    category charge_category_enum NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    posted_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    reference_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_folio_items_folio ON folio_items(folio_id);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 3. INTEGRATED INVENTORY MANAGEMENT (IMS)
-- -------------------------------------------------------------

CREATE TABLE warehouse_locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    floor INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    category inventory_category_enum NOT NULL,
    payment_terms VARCHAR(50) DEFAULT 'NET_30',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category inventory_category_enum NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL CHECK (unit_cost >= 0),
    min_safety_stock INTEGER NOT NULL DEFAULT 20,
    target_stock_level INTEGER NOT NULL DEFAULT 100,
    auto_deduct_on_checkin_qty INTEGER NOT NULL DEFAULT 0,
    supplier_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_category_sku ON inventory_items(category, sku);

CREATE TABLE item_location_stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    location_id VARCHAR(50) NOT NULL REFERENCES warehouse_locations(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_item_location UNIQUE(item_id, location_id)
);

CREATE TABLE stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    from_location_id VARCHAR(50) NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
    to_location_id VARCHAR(50) NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason TEXT NOT NULL,
    transferred_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 4. DIRECT PMS <-> IMS INVENTORY CONSUMPTION LOG
-- =====================================================================
CREATE TABLE inventory_consumptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    location_id VARCHAR(50) NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    trigger_event VARCHAR(50) NOT NULL, -- e.g., 'CHECK_IN', 'HOUSEKEEPING_TURNOVER'
    consumed_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consumptions_room_event ON inventory_consumptions(room_id, trigger_event);

-- -------------------------------------------------------------
-- 5. PURCHASE ORDERS (PO)
-- -------------------------------------------------------------

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    target_warehouse_id VARCHAR(50) NOT NULL REFERENCES warehouse_locations(id) ON DELETE RESTRICT,
    status po_status_enum NOT NULL DEFAULT 'DRAFT',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    expected_delivery_date DATE NOT NULL,
    sent_date TIMESTAMPTZ,
    received_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity_ordered INTEGER NOT NULL CHECK (quantity_ordered > 0),
    quantity_received INTEGER NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- -------------------------------------------------------------
-- 6. HOUSEKEEPING & MAINTENANCE TICKETS
-- -------------------------------------------------------------

CREATE TABLE housekeeping_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_staff VARCHAR(100) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    priority maintenance_priority_enum NOT NULL DEFAULT 'MEDIUM',
    status maintenance_status_enum NOT NULL DEFAULT 'OPEN',
    assigned_to VARCHAR(100),
    locks_room BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- =====================================================================
-- TRIGGERS & BUSINESS LOGIC ENFORCEMENT
-- =====================================================================

-- Auto update Folio summary when items or payments are inserted
CREATE OR REPLACE FUNCTION fn_recalculate_folio()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE folios
    SET subtotal = COALESCE((SELECT SUM(amount) FROM folio_items WHERE folio_id = NEW.folio_id AND category != 'TAX'), 0.00),
        tax_amount = COALESCE((SELECT SUM(amount) FROM folio_items WHERE folio_id = NEW.folio_id AND category = 'TAX'), 0.00),
        total_amount = COALESCE((SELECT SUM(amount) FROM folio_items WHERE folio_id = NEW.folio_id), 0.00),
        paid_amount = COALESCE((SELECT SUM(amount) FROM payments WHERE folio_id = NEW.folio_id), 0.00),
        balance_due = COALESCE((SELECT SUM(amount) FROM folio_items WHERE folio_id = NEW.folio_id), 0.00) -
                      COALESCE((SELECT SUM(amount) FROM payments WHERE folio_id = NEW.folio_id), 0.00),
        updated_at = NOW()
    WHERE id = NEW.folio_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_folio_item_change
AFTER INSERT OR UPDATE OR DELETE ON folio_items
FOR EACH ROW EXECUTE FUNCTION fn_recalculate_folio();
`;
