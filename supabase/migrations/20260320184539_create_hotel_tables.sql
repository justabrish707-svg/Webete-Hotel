/*
  # Arbaminch Webete Hotel Database Schema

  ## Overview
  Creates the database structure for a luxury hotel booking and management system.

  ## New Tables

  ### 1. `bookings`
  Stores guest reservation requests
  - `id` (uuid, primary key) - Unique booking identifier
  - `guest_name` (text) - Full name of the guest
  - `email` (text) - Guest email address
  - `phone` (text) - Contact phone number
  - `check_in` (date) - Check-in date
  - `check_out` (date) - Check-out date
  - `room_type` (text) - Type of room booked
  - `guests` (integer) - Number of guests
  - `special_requests` (text) - Additional requests or notes
  - `status` (text) - Booking status (pending, confirmed, cancelled)
  - `created_at` (timestamptz) - Timestamp of booking creation

  ### 2. `contact_messages`
  Stores messages from the contact form
  - `id` (uuid, primary key) - Unique message identifier
  - `name` (text) - Sender's name
  - `email` (text) - Sender's email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `created_at` (timestamptz) - Timestamp of message submission

  ### 3. `newsletter_subscribers`
  Stores newsletter subscription emails
  - `id` (uuid, primary key) - Unique subscriber identifier
  - `email` (text, unique) - Subscriber email address
  - `subscribed_at` (timestamptz) - Timestamp of subscription

  ## Security
  - Enable RLS on all tables
  - Allow public INSERT for bookings, contacts, and newsletter (public forms)
  - Restrict SELECT to authenticated users only (admin access)
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  room_type text NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  special_requests text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT 'General Inquiry',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Anyone can submit a booking"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Contact messages policies
CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view newsletter subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);