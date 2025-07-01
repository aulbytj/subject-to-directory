import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a singleton browser client to prevent multiple instances
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
})();

// Types for our database
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'buyer' | 'seller' | 'both';
  phone?: string;
  bio?: string;
  location?: string;
  verified: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: 'single_family' | 'townhouse' | 'condo' | 'multi_family' | 'duplex' | 'other';
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  current_loan_balance: number;
  interest_rate: number;
  monthly_payment: number;
  asking_price: number;
  property_value: number;
  monthly_rent?: number;
  property_taxes?: number;
  insurance?: number;
  hoa_fees?: number;
  loan_type?: string;
  lender?: string;
  years_remaining?: number;
  due_on_sale_clause: boolean;
  status: 'active' | 'pending' | 'sold' | 'withdrawn';
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  property_images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  caption?: string;
  order_index: number;
  created_at: string;
}

export interface Message {
  id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  recipient?: Profile;
  properties?: Property;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  properties?: Property;
}