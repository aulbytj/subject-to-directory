import { getSupabaseClient } from './supabase-client';
import { Favorite } from './supabase';

const supabase = getSupabaseClient();

export const favorites = {
  // Add property to favorites
  async addFavorite(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, property_id: propertyId }])
      .select()
      .single();

    return { data: data as Favorite, error };
  },

  // Remove property from favorites
  async removeFavorite(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);

    return { error };
  },

  // Get user's favorites
  async getUserFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        properties (
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
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data: data as Favorite[], error };
  },

  // Check if property is favorited by user
  async isFavorite(propertyId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isFavorite: false, error: null };

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .maybeSingle();

    return { isFavorite: !!data, error };
  },
};