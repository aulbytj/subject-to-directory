/*
  # Complete Subject-To Directory Schema

  1. New Tables
    - `profiles` - Extended user profiles with role information
    - `properties` - Property listings with all financial details
    - `property_images` - Images for properties
    - `messages` - Secure messaging between users
    - `favorites` - User saved/favorited properties
    - `property_views` - Track property view counts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for property visibility and messaging

  3. Functions
    - Update property view counts
    - Search functionality
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'both');
CREATE TYPE property_status AS ENUM ('active', 'pending', 'sold', 'withdrawn');
CREATE TYPE property_type AS ENUM ('single_family', 'townhouse', 'condo', 'multi_family', 'duplex', 'other');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'buyer',
  phone text,
  bio text,
  location text,
  verified boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  property_type property_type NOT NULL DEFAULT 'single_family',
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms numeric(3,1) NOT NULL DEFAULT 0,
  square_feet integer,
  
  -- Financial details
  current_loan_balance numeric(12,2) NOT NULL,
  interest_rate numeric(5,3) NOT NULL,
  monthly_payment numeric(10,2) NOT NULL,
  asking_price numeric(12,2) NOT NULL,
  property_value numeric(12,2) NOT NULL,
  monthly_rent numeric(10,2),
  
  -- Additional costs
  property_taxes numeric(10,2) DEFAULT 0,
  insurance numeric(10,2) DEFAULT 0,
  hoa_fees numeric(10,2) DEFAULT 0,
  
  -- Loan details
  loan_type text,
  lender text,
  years_remaining integer,
  due_on_sale_clause boolean DEFAULT true,
  
  -- Listing details
  status property_status DEFAULT 'active',
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  caption text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Messages table for secure communication
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Property views tracking
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can read active properties"
  ON properties FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Property owners can manage their properties"
  ON properties FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Property images policies
CREATE POLICY "Anyone can read property images"
  ON property_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_images.property_id 
      AND properties.status = 'active'
    )
  );

CREATE POLICY "Property owners can manage their property images"
  ON property_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_images.property_id 
      AND properties.user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can read their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Favorites policies
CREATE POLICY "Users can manage their favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Property views policies
CREATE POLICY "Anyone can insert property views"
  ON property_views FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(asking_price);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_property ON property_views(property_id);

-- Function to update property view count
CREATE OR REPLACE FUNCTION increment_property_views(property_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET view_count = view_count + 1 
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();