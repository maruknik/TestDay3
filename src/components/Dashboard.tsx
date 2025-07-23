import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { fetchBookingsByUser, fetchMeetingRoomsByUser } from '../services/dashboardService';

type Booking = {
  id: string;
  room_id: string;
  room_name: string;
  start_time: string;
  end_time: string;
  description: string;
};

type MeetingRoom = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUserName(user.user_metadata?.name ?? null);
        setUserEmail(user.email ?? '');

        const userRole = user.user_metadata?.role === 'admin' ? 'admin' : 'user';
        setRole(userRole);

        if (!user.email) {
          alert('Email користувача відсутній');
          return;
        }

        const userRooms = await fetchMeetingRoomsByUser(user.email);
        setRooms(userRooms);

        const userBookingsRaw = await fetchBookingsByUser(user.id);
        const userBookings = userBookingsRaw.map(b => ({
          ...b,
          description: b.description ?? '',
        }));
        setBookings(userBookings);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  if (loading)
    return (
      <p className="p-8 text-center text-gray-700 dark:text-gray-300">Завантаження...</p>
    );

  return (
    <div className="max-w-5xl mx-auto pt-6 px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
        Вітаємо, {userName ?? userEmail}!
      </h1>
      <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
        Ваша роль: <span className="font-semibold capitalize">{role}</span>
      </p>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          Ваші переговорні кімнати
        </h2>
        {rooms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 italic">Ви ще не маєте жодної кімнати.</p>
        ) : (
          <ul className="space-y-4">
            {rooms.map(room => (
              <li
                key={room.id}
                className="p-5 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-shadow shadow-sm hover:shadow-md flex justify-between items-center"
          
                onClick={() => navigate(`/meeting-rooms/${room.id}/bookings`)}
                role="button"
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(`/meeting-rooms/${room.id}/bookings`);
                }}
              >
                <span className="text-xl font-medium text-gray-900 dark:text-white">{room.name}</span>

                {role === 'admin' && (
                  <button
                    onClick={e => {
                      e.stopPropagation(); 
                      navigate(`/meeting-rooms/${room.id}/users`);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded ml-4"
                  >
                    Керувати користувачами
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-5 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
          Найближчі бронювання
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 italic">У вас немає активних бронювань.</p>
        ) : (
          <ul className="space-y-4">
            {bookings
              .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .slice(0, 5)
              .map(b => (
                <li
                  key={b.id}
                  className="p-5 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-shadow shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/meeting-rooms/${b.room_id}/bookings/${b.id}/edit`)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={e => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/meeting-rooms/${b.room_id}/bookings/${b.id}/edit`);
                  }}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{b.room_name}</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{b.description}</div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/meeting-rooms')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded transition"
        >
          Кімнати
        </button>

        {role === 'admin' && (
          <button
            onClick={() => navigate('/meeting-rooms/new')}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded transition"
          >
            Створити кімнату
          </button>
        )}
      </div>
    </div>
  );
}
