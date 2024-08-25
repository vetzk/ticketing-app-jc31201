import { UserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { ComponentType, useContext, useEffect } from 'react';

const withAuth = (WrappedComponent: ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const { user } = useContext(UserContext);

    useEffect(() => {
      console.log(user);

      if (user?.role === 'ADMIN') {
        router.replace('/admin/profile');
      }
    }, [router, user]);

    if (user || !user) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
  return AuthenticatedComponent;
};

export default withAuth;
