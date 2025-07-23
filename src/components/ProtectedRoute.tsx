import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession, onAuthChange } from '../services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    checkSession().then(setIsAuth);

    const unsubscribe = onAuthChange(setIsAuth);
    return () => unsubscribe();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}
