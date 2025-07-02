// Auto-generated types for Supabase database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      properties: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          is_primary: boolean;
          caption?: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['property_images']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['property_images']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          property_id: string;
          sender_id: string;
          recipient_id: string;
          subject?: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_property_views: {
        Args: {
          property_uuid: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}