import { getSupabaseClient } from './supabase-client';
import { Property } from './supabase';

// Use the authenticated client
const supabase = getSupabaseClient();

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

  // Upload property images to Supabase Storage and save metadata
  async uploadPropertyImages(propertyId: string, imageFiles: { file: File; is_primary: boolean }[]) {
    const uploadedImages = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const { file, is_primary } = imageFiles[i];
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}/${Date.now()}-${i}.${fileExt}`;
      
      try {
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          continue; // Skip this image and continue with others
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        // Save image metadata to database
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .insert([{
            property_id: propertyId,
            image_url: urlData.publicUrl,
            is_primary: is_primary,
            order_index: i,
            caption: null
          }])
          .select()
          .single();

        if (imageError) {
          console.error('Image metadata save error:', imageError);
          // Try to clean up uploaded file
          await supabase.storage.from('property-images').remove([fileName]);
          continue;
        }

        uploadedImages.push(imageData);
      } catch (error) {
        console.error('Error processing image:', error);
        continue;
      }
    }

    return { data: uploadedImages, error: uploadedImages.length === 0 ? new Error('No images uploaded successfully') : null };
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