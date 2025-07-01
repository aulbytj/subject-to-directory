import { supabase, Property } from './supabase';

export interface PropertyFilters {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minInterestRate?: number;
  maxInterestRate?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
}

export const properties = {
  // Get all active properties with optional filters
  async getProperties(filters?: PropertyFilters, limit = 50, offset = 0) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          verified
        ),
        property_images (
          id,
          image_url,
          is_primary,
          caption
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters?.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }
    if (filters?.minPrice) {
      query = query.gte('asking_price', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte('asking_price', filters.maxPrice);
    }
    if (filters?.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters?.minInterestRate) {
      query = query.gte('interest_rate', filters.minInterestRate);
    }
    if (filters?.maxInterestRate) {
      query = query.lte('interest_rate', filters.maxInterestRate);
    }
    if (filters?.minBedrooms) {
      query = query.gte('bedrooms', filters.minBedrooms);
    }
    if (filters?.maxBedrooms) {
      query = query.lte('bedrooms', filters.maxBedrooms);
    }

    const { data, error } = await query;
    return { data: data as Property[], error };
  },

  // Get single property by ID
  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          phone,
          email,
          verified,
          bio
        ),
        property_images (
          id,
          image_url,
          is_primary,
          caption,
          order_index
        )
      `)
      .eq('id', id)
      .single();

    return { data: data as Property, error };
  },

  // Create new property
  async createProperty(property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    return { data: data as Property, error };
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: data as Property, error };
  },

  // Delete property
  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Increment property view count
  async incrementViewCount(propertyId: string) {
    const { error } = await supabase.rpc('increment_property_views', {
      property_uuid: propertyId
    });

    return { error };
  },

  // Get user's properties
  async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data as Property[], error };
  },

  // Get featured properties
  async getFeaturedProperties(limit = 6) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          verified
        ),
        property_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data: data as Property[], error };
  },

  // Search properties
  async searchProperties(searchTerm: string, limit = 20) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          verified
        ),
        property_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data: data as Property[], error };
  },
};