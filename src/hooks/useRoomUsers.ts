import { useEffect, useState } from 'react';
import { fetchRoomUsers, addRoomUser, updateRoomUserRole, removeRoomUser } from '../services/roomUsersService';
import type { UserRole } from '../types/role';

type RoomUser = {
  email: string;
  role: 'admin' | 'user';
};

export const useRoomUsers = (roomId: string | undefined) => {
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
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

  return {
    users,
    email,
    role,
    loading,
    error,
    setEmail,
    setRole,
    handleAddUser,
    handleRoleChange,
    handleRemoveUser,
  };
};
