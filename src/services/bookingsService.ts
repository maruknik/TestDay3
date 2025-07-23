import { supabase } from '../supabaseClient';

export type Booking = {
  id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  description: string;
  user_email: string;
};

export async function fetchBookingsByRoom(roomId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('room_id', roomId)
    .order('start_time', { ascending: true });

  if (error) throw error;

  return (
    data?.map((item: any) => ({
      id: item.id,
      room_id: item.room_id,
      start_time: item.start_time,
      end_time: item.end_time,
      description: item.description,
      user_email: item.users?.email ?? 'Невідомий',
    })) ?? []
  );
}

export async function getBookingById(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBooking(booking: {
  room_id: string;
  start_time: string;
  end_time: string;
  description: string;
  user_id: string;
}) {
  const { error } = await supabase.from('bookings').insert(booking);
  if (error) throw error;
}


export async function updateBooking(
  id: string,
  booking: { start_time: string; end_time: string; description: string }
) {
  const { error } = await supabase.from('bookings').update(booking).eq('id', id);
  if (error) throw error;
}

export async function deleteBooking(id: string) {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
}

export async function checkBookingConflict(
  roomId: string,
  start_time: string,
  end_time: string,
  excludeBookingId?: string
): Promise<boolean> {
  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('room_id', roomId)
    .lt('start_time', end_time)   
    .gt('end_time', start_time); 

  if (excludeBookingId) {
    query = query.neq('id', excludeBookingId);
  }

  const { count, error } = await query;

  if (error) throw error;

  return (count ?? 0) > 0;
}


