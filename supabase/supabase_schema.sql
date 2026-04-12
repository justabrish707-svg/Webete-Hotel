-- Run this entire script in your Supabase SQL Editor to initialize the database for the Webete Hotel project.

-- 1. Create Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    price INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    available BOOLEAN DEFAULT true,
    image TEXT NOT NULL
);

-- 2. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    room_type TEXT NOT NULL,
    guests INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create System Logs Table (for security and audit trails)
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Initialize settings
INSERT INTO system_settings (key, value) VALUES ('lockdown', 'false'::jsonb) ON CONFLICT (key) DO NOTHING;

-- 6. Insert Default Rooms
INSERT INTO rooms (id, name, type, price, capacity, available, image) VALUES 
('101', 'Standard Unit A', 'Standard Room', 1500, 2, true, '/standard_room_1774779508016.png'),
('102', 'Standard Unit B', 'Standard Room', 1500, 2, false, '/standard_room_1774779508016.png'),
('201', 'Deluxe Lake View', 'Deluxe Room', 2150, 2, true, '/room_deluxe_v2.webp'),
('202', 'Executive Suite', 'Executive Suite', 3450, 2, true, '/webete_bedroom_3.jpg'),
('301', 'Family Villa', 'Family Suite', 4200, 4, true, '/executive_suite_1774779542015.png')
ON CONFLICT (id) DO NOTHING;

-- 7. Set up Security (Row Level Security)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access where needed
CREATE POLICY "Public rooms are viewable by everyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Public can add messages" ON messages FOR INSERT WITH CHECK (true);

-- SECURE: Public can NO LONGER add bookings directly. 
-- All bookings must go through Edge Functions (which use service_role).
-- This prevents injection of "Confirmed" status without payment.
DROP POLICY IF EXISTS "Public can add bookings" ON bookings;

-- Allow authenticated admins (and service_role) full access
CREATE POLICY "Admins full access on rooms" ON rooms TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on bookings" ON bookings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on messages" ON messages TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on system_logs" ON system_logs TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access on settings" ON system_settings TO authenticated USING (true) WITH CHECK (true);
