'use client';

import { UserContextType, UserType } from './type';
import * as React from 'react';
import apiCall from '@/helper/apiCall';
import { toast } from 'react-toastify';

export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

interface IUserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FunctionComponent<IUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const keepLogin = async () => {
    try {
      const checkToken = localStorage.getItem('token');
      if (checkToken) {
        const { data } = await apiCall.get('/api/auth/keeplogin', {
          headers: {
            Authorization: `Bearer ${checkToken}`,
          },
        });
        console.log(data);
        localStorage.setItem('token', data.result.token);
        setUser({
          email: data.result.email,
          identificationId: data.result.identificationId,
          refCode: data.result.refCode,
          role: data.result.role,
          points: data.result.points,
          image: data.result.image,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      keepLogin();
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
