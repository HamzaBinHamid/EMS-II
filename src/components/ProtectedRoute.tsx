// src/components/ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(role ?? '')) {
        router.push('/unauthorized');
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}
