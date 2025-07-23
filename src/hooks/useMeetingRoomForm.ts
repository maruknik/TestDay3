import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMeetingRoom, getMeetingRoomById, updateMeetingRoom } from '../services/meetingRoomsService';

export function useMeetingRoomForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      getMeetingRoomById(id)
        .then(room => {
          if (room) {
            setName(room.name);
            setDescription(room.description || '');
          }
        })
        .catch(() => setError('Не вдалося завантажити кімнату'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Вкажіть назву кімнати');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (id) {
        await updateMeetingRoom(id, { name, description });
      } else {
        await createMeetingRoom({ name, description });
      }
      navigate('/meeting-rooms');
    } catch {
      setError('Сталася помилка при збереженні');
    } finally {
      setLoading(false);
    }
  };

  return {
    id,
    name,
    setName,
    description,
    setDescription,
    loading,
    error,
    handleSubmit,
    navigate,
  };
}
