import { useNavigate } from 'react-router-dom';
import { useMeetingRooms } from '../../hooks/useMeetingRooms';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useUserRoles } from '../../hooks/useUserRoles';
import { deleteMeetingRoom, addRoomUser } from '../../services/meetingRoomsService';

export default function MeetingRoomsList() {
  const navigate = useNavigate();
  const userEmail = useCurrentUser();
  const userRoles = useUserRoles(userEmail);
  const { rooms, setRooms, loading } = useMeetingRooms();

  const handleDelete = async (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю кімнату?')) {
      await deleteMeetingRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!userEmail) {
      alert('Потрібно увійти');
      return;
    }

    try {
      await addRoomUser(roomId, userEmail, 'user');
      alert('Ви долучились до кімнати');
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
            {rooms.map(room => {
              const role = userRoles[room.id] || null;

              return (
                <li
                  key={room.id}
                  className="flex justify-between items-center bg-gray-700 rounded-lg p-6 shadow-md"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {room.name}
                    </h2>
                    <p className="mt-1 text-gray-400">
                      {room.description || 'Без опису'}
                    </p>
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
                      onClick={() =>
                        navigate(`/meeting-rooms/${room.id}/bookings`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-md font-medium transition"
                    >
                      Бронювання
                    </button>

                    {role === 'admin' && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/meeting-rooms/${room.id}/edit`)
                          }
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
                          onClick={() =>
                            navigate(`/meeting-rooms/${room.id}/users`)
                          }
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
