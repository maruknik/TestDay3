import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

type MeetingRoom = {
  id: string;
  name: string;
  description: string;
};

type RoomRoleMap = Record<string, 'admin' | 'user' | null>;

export default function MeetingRoomsList() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<RoomRoleMap>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRooms = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email);


      const { data: roleData, error: roleError } = await supabase
        .from('room_user_roles')
        .select('room_id, role')
        .eq('user_email', user.email);

      if (roleError) {
        console.error('Помилка отримання ролей користувача:', roleError);
        setLoading(false);
        return;
      }

      if (!roleData || roleData.length === 0) {

        setRooms([]);
        setUserRoles({});
        setLoading(false);
        return;
      }

      const rolesMap: RoomRoleMap = {};
      roleData.forEach((r) => {
        rolesMap[r.room_id] = r.role;
      });
      setUserRoles(rolesMap);

      const roomIds = roleData.map((r) => r.room_id);

      const { data: roomsData, error: roomsError } = await supabase
        .from('meeting_rooms')
        .select('*')
        .in('id', roomIds);

      if (roomsError) {
        console.error('Помилка отримання кімнат:', roomsError);
        setLoading(false);
        return;
      }

      setRooms(roomsData ?? []);
      setLoading(false);
    };

    fetchUserRooms();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю кімнату?')) {
      await supabase.from('meeting_rooms').delete().eq('id', id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!userEmail) {
      alert('Потрібно увійти');
      return;
    }

    try {
      await supabase.from('room_user_roles').insert({
        room_id: roomId,
        user_email: userEmail,
        role: 'user',
      });
      alert('Ви долучились до кімнати');

      const fetchRoomsAfterJoin = async () => {
        const { data: roleData } = await supabase
          .from('room_user_roles')
          .select('room_id, role')
          .eq('user_email', userEmail);

        if (roleData) {
          const rolesMap: RoomRoleMap = {};
          roleData.forEach((r) => {
            rolesMap[r.room_id] = r.role;
          });
          setUserRoles(rolesMap);

          const roomIds = roleData.map((r) => r.room_id);
          const { data: roomsData } = await supabase
            .from('meeting_rooms')
            .select('*')
            .in('id', roomIds);

          setRooms(roomsData ?? []);
        }
      };

      await fetchRoomsAfterJoin();
    } catch {
      alert('Не вдалося долучитись до кімнати');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-4xl mb-6 flex items-center">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-blue-400 hover:text-blue-600 font-semibold"
        >
          ← Назад
        </button>
      </div>

      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-10 text-white text-center">
          Переговорні кімнати
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/meeting-rooms/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-7 rounded-md font-semibold transition"
          >
            Створити нову кімнату
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Завантаження...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">Кімнати не знайдені.</p>
        ) : (
          <ul className="space-y-6">
            {rooms.map((room) => {
              const role = userRoles[room.id] || null;

              return (
                <li
                  key={room.id}
                  className="flex justify-between items-center bg-gray-700 rounded-lg p-6 shadow-md"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{room.name}</h2>
                    <p className="mt-1 text-gray-400">{room.description || 'Без опису'}</p>
                  </div>

                  <div className="flex space-x-4">
                    {!role && (
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      >
                        Долучитись до кімнати
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/meeting-rooms/${room.id}/bookings`)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-md font-medium transition"
                    >
                      Бронювання
                    </button>

                    {role === 'admin' && (
                      <>
                        <button
                          onClick={() => navigate(`/meeting-rooms/${room.id}/edit`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-5 rounded-md font-medium transition"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-md font-medium transition"
                        >
                          Видалити
                        </button>

                        <button
                          onClick={() => navigate(`/meeting-rooms/${room.id}/users`)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-md font-medium transition"
                        >
                          Керувати користувачами
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
