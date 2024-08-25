'use client';
import { ComponentType, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';

interface WithRoleProps {
  // Remove `requiredRole` from here since it should not be passed as a prop
}

function withRole<T extends object>(
  WrappedComponent: ComponentType<T>,
  requiredRole: string,
) {
  const AuthenticatedRole = (props: T) => {
    const router = useRouter();
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace('/login');
        } else if (user.role !== requiredRole) {
          router.replace('/');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || user.role !== requiredRole) {
      return <div>Redirecting...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedRole;
}

export default withRole;
