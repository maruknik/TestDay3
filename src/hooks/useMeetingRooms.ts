import { useEffect, useState } from 'react';
import { fetchMeetingRooms } from '../services/meetingRoomsService';
import type { MeetingRoom } from '../types/types';

export function useMeetingRooms() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const fetched = await fetchMeetingRooms();
      setRooms(fetched);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  return { rooms, setRooms, loading };
}
