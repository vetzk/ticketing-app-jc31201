'use client';
import { ComponentType, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';

interface WithRoleProps {
  requiredRole: string;
}

function withRole<T extends WithRoleProps>(
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
          router.replace('/landing');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Show loading if context is still loading
    }

    if (!user || user.role !== requiredRole) {
      return <div>Redirecting...</div>; // Show redirect message if role doesn't match
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedRole;
}

export default withRole;
