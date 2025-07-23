import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { fetchBookingsByUser, fetchMeetingRoomsByUser } from '../services/dashboardService';
import type { NullableUserRole } from '../types/role';
import * as styles from './ui/dashboardStyles';

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
  const [userRole, setRole] = useState<NullableUserRole>(null);
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
        const role = user.user_metadata?.role === 'admin' ? 'admin' : 'user';
        setRole(role);

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

  const displayName = useMemo(() => userName ?? userEmail, [userName, userEmail]);

  const sortedBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5);
  }, [bookings]);

  if (loading) return <p className={styles.loadingText}>Завантаження...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Вітаємо, {displayName}!</h1>

      <p className={styles.userRoleText}>
        Ваша роль: <span className="font-semibold capitalize">{userRole}</span>
      </p>

      <section className="mb-10">
        <h2 className={styles.sectionTitle}>Ваші переговорні кімнати</h2>
        {rooms.length === 0 ? (
          <p className={styles.noDataText}>Ви ще не маєте жодної кімнати.</p>
        ) : (
          <ul className="space-y-4">
            {rooms.map(room => (
              <li
                key={room.id}
                className={styles.roomCard}
                onClick={() => navigate(`/meeting-rooms/${room.id}/bookings`)}
                role="button"
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/meeting-rooms/${room.id}/bookings`);
                  }
                }}
              >
                <span className={styles.roomName}>{room.name}</span>

                {userRole === 'admin' && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/meeting-rooms/${room.id}/users`);
                    }}
                    className={styles.manageButton}
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
        <h2 className={styles.sectionTitle}>Найближчі бронювання</h2>
        {sortedBookings.length === 0 ? (
          <p className={styles.noDataText}>У вас немає активних бронювань.</p>
        ) : (
          <ul className="space-y-4">
            {sortedBookings.map(b => (
              <li
                key={b.id}
                className={styles.bookingCard}
                onClick={() => navigate(`/meeting-rooms/${b.room_id}/bookings/${b.id}/edit`)}
                role="button"
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/meeting-rooms/${b.room_id}/bookings/${b.id}/edit`);
                  }
                }}
              >
                <div className={styles.bookingTitle}>{b.room_name}</div>
                <div className={styles.bookingTime}>
                  {new Date(b.start_time).toLocaleString()} –{' '}
                  {new Date(b.end_time).toLocaleString()}
                </div>
                <div className={styles.bookingDescription}>{b.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.buttonGroup}>
        <button onClick={() => navigate('/meeting-rooms')} className={styles.primaryButton}>
          Кімнати
        </button>

        {userRole === 'admin' && (
          <button onClick={() => navigate('/meeting-rooms/new')} className={styles.createButton}>
            Створити кімнату
          </button>
        )}
      </div>
    </div>
  );
}
