import { supabase } from '../supabaseClient';

export type MeetingRoom = {
  id: string;
  name: string;
  description?: string;
};

export type Booking = {
  id: string;
  room_id: string;
  room_name: string;
  start_time: string;
  end_time: string;
  description?: string;
};



export async function fetchMeetingRoomsByUser(userEmail: string): Promise<MeetingRoom[]> {
  const { data, error } = await supabase
    .from('room_user_roles')  
    .select('room_id, meeting_rooms(id, name)')
    .eq('user_email', userEmail);

  if (error) throw error;

  return data?.map((item: any) => ({
    id: item.meeting_rooms.id,
    name: item.meeting_rooms.name,
  })) || [];
}

export async function fetchBookingsByUser(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      room_id,
      start_time,
      end_time,
      description,
      meeting_rooms(name)
    `)
    .eq('user_id', userId) 
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data?.map((booking: any) => ({
    id: booking.id,
    room_id: booking.room_id,
    room_name: booking.meeting_rooms?.name || 'Без назви',
    start_time: booking.start_time,
    end_time: booking.end_time,
    description: booking.description,
  })) || [];
}
