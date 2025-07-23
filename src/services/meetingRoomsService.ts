import { supabase } from '../supabaseClient';

export type MeetingRoom = {
  id: string;
  name: string;
  description: string;
};

export async function fetchMeetingRooms(): Promise<MeetingRoom[]> {
  const { data, error } = await supabase
    .from('meeting_rooms')
    .select('*');
  if (error) throw error;
  return data ?? [];
}

export async function getMeetingRoomById(id: string): Promise<MeetingRoom | null> {
  const { data, error } = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createMeetingRoom(room: { name: string; description: string }) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) throw new Error('Користувач не авторизований');

  const { data: createdRoom, error: roomError } = await supabase
    .from('meeting_rooms')
    .insert(room)
    .select()
    .single(); 

  if (roomError || !createdRoom) throw roomError;

  const { error: roleError } = await supabase.from('room_user_roles').insert({
    room_id: createdRoom.id,
    user_email: user.user.email,
    role: 'admin',
  });

  if (roleError) throw roleError;
}


export async function updateMeetingRoom(id: string, room: { name: string; description: string }) {
  const { error } = await supabase.from('meeting_rooms').update(room).eq('id', id);
  if (error) throw error;
}

export async function deleteMeetingRoom(id: string) {
  const { error } = await supabase.from('meeting_rooms').delete().eq('id', id);
  if (error) throw error;
}

export async function addRoomUser(roomId: string, userEmail: string, role: 'admin' | 'user') {

  const { error } = await supabase.from('room_user_roles').insert({
    room_id: roomId,
    user_email: userEmail,
    role,
  });
  if (error) throw error;
}
