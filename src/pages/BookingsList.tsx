import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBookingsByRoom, deleteBooking } from '../services/bookingsService';
import { supabase } from '../supabaseClient';

type Booking = {
  id: string;
  start_time: string;
  end_time: string;
  description: string;
  user_email: string;
};

export default function BookingsList() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm('Видалити бронювання?')) {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  if (loading || userRole === null) {
    return <p className="text-center text-gray-400 py-8">Завантаження...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate('/meeting-rooms')}
            className="text-blue-400 hover:text-blue-600 font-semibold"
          >
            ← Назад
          </button>
          <h1 className="text-4xl font-bold text-white text-center flex-grow">
            Бронювання кімнати
          </h1>
          <div style={{ width: 60 }} />
        </div>

        {userRole === 'admin' && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate(`/meeting-rooms/${roomId}/bookings/new`)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-7 rounded-md font-semibold transition"
            >
              Створити бронювання
            </button>
          </div>
        )}

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">Бронювання не знайдені.</p>
        ) : (
          <ul className="space-y-6">
            {bookings.map(b => (
              <li
                key={b.id}
                className="flex justify-between items-center bg-gray-700 rounded-lg p-6 shadow-md"
              >
                <div className="text-gray-300">
                  <p>
                    <span className="font-semibold text-white">З:</span>{' '}
                    {new Date(b.start_time).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-white">По:</span>{' '}
                    {new Date(b.end_time).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Опис:</span>{' '}
                    {b.description || 'Без опису'}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Користувач:</span>{' '}
                    {b.user_email}
                  </p>
                </div>

                {userRole === 'admin' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/meeting-rooms/${roomId}/bookings/${b.id}/edit`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-5 rounded-md font-medium transition"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-md font-medium transition"
                    >
                      Видалити
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
