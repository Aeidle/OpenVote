import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { ComponentType, useEffect } from 'react';
import { Role } from '../types/auth';

export function withAuth<T extends object>(
  WrappedComponent: ComponentType<T>,
  allowedRoles: Role[]
) {
  return function WithAuthComponent(props: T) {
    const { user, isAuthenticated, loading, checkRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace('/login');
        } else if (!checkRole(allowedRoles)) {
          router.replace('/unauthorized');
        }
      }
    }, [loading, isAuthenticated, router, checkRole]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (!checkRole(allowedRoles)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
