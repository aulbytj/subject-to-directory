import { getSupabaseClient } from './supabase-client';
import { Message } from './supabase';

const supabase = getSupabaseClient();

export interface SendMessageData {
  propertyId: string;
  recipientId: string;
  subject?: string;
  content: string;
}

export const messages = {
  // Send a message
  async sendMessage({ propertyId, recipientId, subject, content }: SendMessageData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        property_id: propertyId,
        sender_id: user.id,
        recipient_id: recipientId,
        subject,
        content
      }])
      .select(`
        *,
        sender:sender_id (
          id,
          full_name,
          email
        ),
        recipient:recipient_id (
          id,
          full_name,
          email
        ),
        properties (
          id,
          title,
          address
        )
      `)
      .single();

    return { data: data as Message, error };
  },

  // Get user's received messages
  async getReceivedMessages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          full_name,
          email,
          verified
        ),
        properties (
          id,
          title,
          address,
          asking_price
        )
      `)
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    return { data: data as Message[], error };
  },

  // Get user's sent messages
  async getSentMessages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        recipient:recipient_id (
          id,
          full_name,
          email
        ),
        properties (
          id,
          title,
          address,
          asking_price
        )
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    return { data: data as Message[], error };
  },

  // Mark message as read
  async markAsRead(messageId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .eq('recipient_id', user.id);

    return { error };
  },

  // Get conversation for a property
  async getPropertyConversation(propertyId: string, otherUserId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          full_name
        ),
        recipient:recipient_id (
          id,
          full_name
        )
      `)
      .eq('property_id', propertyId)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    return { data: data as Message[], error };
  },

  // Get unread message count
  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);

    return { count, error };
  },
};