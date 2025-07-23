import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { fetchBookingsByRoom } from '../services/bookingsService';
import type { NullableUserRole } from '../types/role';

export type Booking = {
  id: string;
  start_time: string;
  end_time: string;
  description: string;
  user_email: string;
};

export function useRoomBookings(roomId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<NullableUserRole>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user?.email) return;

        const email = userData.user.email;

        const { data: roleData, error: roleError } = await supabase
          .from('room_user_roles')
          .select('role')
          .eq('room_id', roomId)
          .eq('user_email', email)
          .single();

        if (!roleError && roleData?.role) {
          setUserRole(roleData.role);
        }

        const bookingsData = await fetchBookingsByRoom(roomId);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Помилка завантаження бронювань:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  return { bookings, setBookings, loading, userRole };
}
