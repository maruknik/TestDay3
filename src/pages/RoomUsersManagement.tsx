import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoomUsers, addRoomUser, updateRoomUserRole, removeRoomUser } from '../services/roomUsersService';

type RoomUser = {
  email: string;
  role: 'admin' | 'user';
};

export default function RoomUsersManagement() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [users, setUsers] = useState<RoomUser[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    fetchRoomUsers(roomId)
      .then(setUsers)
      .catch(() => setError('Не вдалося завантажити користувачів'))
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleAddUser = async () => {
    setError('');
    if (!email) {
      setError('Вкажіть email');
      return;
    }
    try {
      await addRoomUser(roomId!, email, role);
      const updatedUsers = await fetchRoomUsers(roomId!);
      setUsers(updatedUsers);
      setEmail('');
    } catch (e) {
      setError('Не вдалося додати користувача');
    }
  };

  const handleRoleChange = async (userEmail: string, newRole: 'admin' | 'user') => {
    try {
      await updateRoomUserRole(roomId!, userEmail, newRole);
      const updatedUsers = await fetchRoomUsers(roomId!);
      setUsers(updatedUsers);
    } catch {
      setError('Не вдалося змінити роль');
    }
  };

  const handleRemoveUser = async (userEmail: string) => {
    if (confirm('Видалити користувача з кімнати?')) {
      try {
        await removeRoomUser(roomId!, userEmail); 
        setUsers(users.filter(u => u.email !== userEmail));
      } catch {
        setError('Не вдалося видалити користувача');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Користувачі кімнати</h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Email користувача"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'admin' | 'user')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Додати
          </button>
        </div>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        {loading ? (
          <p className="text-center">Завантаження...</p>
        ) : (
          <ul className="space-y-3">
            {users.map(u => (
              <li
                key={u.email}
                className="flex justify-between items-center border border-gray-300 dark:border-gray-600 p-3 rounded bg-gray-50 dark:bg-gray-700"
              >
                <div className="truncate">{u.email}</div>
                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.email, e.target.value as 'admin' | 'user')}
                    className="p-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRemoveUser(u.email)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/meeting-rooms')}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          >
            ← Назад до кімнат
          </button>
        </div>
      </div>
    </div>
  );
}
