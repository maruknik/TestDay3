import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useCurrentUser() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);
      }
    };

    fetchUser();
  }, []);

  return userEmail;
}
