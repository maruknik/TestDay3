import { supabase } from '../supabaseClient';

export type RoomUser = {
  email: string;
  role: 'admin' | 'user';
};

export async function fetchRoomUsers(roomId: string): Promise<RoomUser[]> {
  const { data, error } = await supabase
    .from('room_user_roles')
    .select('user_email, role')
    .eq('room_id', roomId);

  if (error) throw error;

  return data?.map((item: any) => ({
    email: item.user_email,
    role: item.role,
  })) ?? [];
}

export async function addRoomUser(roomId: string, email: string, role: 'admin' | 'user') {
  const { error } = await supabase
    .from('room_user_roles')
    .insert([{ room_id: roomId, user_email: email, role }]);

  if (error) throw error;
}

export async function updateRoomUserRole(roomUserEmail: string, roomId: string, role: 'admin' | 'user') {
  const { error } = await supabase
    .from('room_user_roles')
    .update({ role })
    .eq('room_id', roomId)
    .eq('user_email', roomUserEmail);

  if (error) throw error;
}

export async function removeRoomUser(roomUserEmail: string, roomId: string) {
  const { error } = await supabase
    .from('room_user_roles')
    .delete()
    .eq('room_id', roomId)
    .eq('user_email', roomUserEmail);

  if (error) throw error;
}
