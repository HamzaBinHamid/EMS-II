import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';

export function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  const ProtectedRoute = (props: P) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      (async () => {
        if (!user) {
          router.push('/login');
          return;
        }
        if (!allowedRoles.includes(user.role)) {
          router.push('/');
        }
      })();
    }, [user, router]); // removed allowedRoles

    if (!user || !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
}
