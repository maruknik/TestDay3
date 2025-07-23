import { useState, useEffect } from 'react';
import {
  createBooking,
  getBookingById,
  updateBooking,
  checkBookingConflict,
} from '../services/bookingsService';
import { supabase } from '../supabaseClient';

export function useBooking(roomId: string, bookingId?: string) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;

    setLoading(true);
    getBookingById(bookingId)
      .then(b => {
        if (b) {
          setStartTime(b.start_time.slice(0, 16));
          setEndTime(b.end_time.slice(0, 16));
          setDescription(b.description);
        }
      })
      .catch(() => setError('Не вдалося завантажити бронювання'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const saveBooking = async () => {
    if (!startTime || !endTime || new Date(startTime) >= new Date(endTime)) {
      setError('Вкажіть коректний час початку і кінця');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      const conflict = await checkBookingConflict(roomId, startTime, endTime, bookingId);
      if (conflict) {
        setError('Конфлікт бронювання: цей час уже зайнятий');
        setLoading(false);
        return false;
      }

      if (bookingId) {
        await updateBooking(bookingId, { start_time: startTime, end_time: endTime, description });
      } else {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user?.id) {
          setError('Не вдалося отримати поточного користувача');
          setLoading(false);
          return false;
        }

        await createBooking({
          room_id: roomId,
          start_time: startTime,
          end_time: endTime,
          description,
          user_id: user.id,
        });
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setError('Сталася помилка при збереженні');
      setLoading(false);
      return false;
    }
  };

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    loading,
    error,
    saveBooking,
  };
}
