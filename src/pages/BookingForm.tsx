import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createBooking,
  getBookingById,
  updateBooking,
  checkBookingConflict,
} from '../services/bookingsService';
import { supabase } from '../supabaseClient';

export default function BookingForm() {
  const { roomId, bookingId } = useParams<{ roomId: string; bookingId?: string }>();
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
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
    }
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime || new Date(startTime) >= new Date(endTime)) {
      setError('Вкажіть коректний час початку і кінця');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const conflict = await checkBookingConflict(roomId!, startTime, endTime, bookingId);
      if (conflict) {
        setError('Конфлікт бронювання: цей час уже зайнятий');
        setLoading(false);
        return;
      }

      if (bookingId) {
        await updateBooking(bookingId, {
          start_time: startTime,
          end_time: endTime,
          description,
        });
      } else {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user?.id) {
          setError('Не вдалося отримати поточного користувача');
          setLoading(false);
          return;
        }

        await createBooking({
          room_id: roomId!,
          start_time: startTime,
          end_time: endTime,
          description,
          user_id: user.id,
        });
      }

      navigate(`/meeting-rooms/${roomId}/bookings`);
    } catch (err) {
      console.error(err);
      setError('Сталася помилка при збереженні');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(`/meeting-rooms/${roomId}/bookings`)}
            className="text-blue-400 hover:text-blue-600 font-semibold"
          >
            ← Назад
          </button>
          <h1 className="text-3xl font-bold text-white text-center flex-grow">
            {bookingId ? 'Редагувати бронювання' : 'Створити бронювання'}
          </h1>
          <div style={{ width: 60 }} />
        </div>

        {error && <p className="mb-6 text-red-500 text-center font-medium">{error}</p>}

        <label htmlFor="startTime" className="block mb-2 font-semibold text-gray-300">
          Початок
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="w-full mb-5 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <label htmlFor="endTime" className="block mb-2 font-semibold text-gray-300">
          Кінець
        </label>
        <input
          id="endTime"
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="w-full mb-5 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />

        <label htmlFor="description" className="block mb-2 font-semibold text-gray-300">
          Опис
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full mb-6 p-3 rounded-md bg-gray-700 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={4}
          placeholder="Додайте опис бронювання (необов’язково)"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md text-white font-semibold transition"
        >
          {loading ? 'Збереження...' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
}
