import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type RoomRoleMap = Record<string, 'admin' | 'user' | null>;

export function useUserRoles(userEmail: string | null) {
  const [userRoles, setUserRoles] = useState<RoomRoleMap>({});

  useEffect(() => {
    const fetchRoles = async () => {
      if (!userEmail) return;

      const { data: roleData, error } = await supabase
        .from('room_user_roles')
        .select('room_id, role')
        .eq('user_email', userEmail);

      if (!error && roleData) {
        const rolesMap: RoomRoleMap = {};
        roleData.forEach((r: any) => {
          rolesMap[r.room_id] = r.role;
        });
        setUserRoles(rolesMap);
      }
    };

    fetchRoles();
  }, [userEmail]);

  return userRoles;
}
