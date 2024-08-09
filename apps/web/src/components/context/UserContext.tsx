"use client";
import * as React from "react";
import { UserContextType, UserType } from "./types";
import { apiCall } from "@/helper/axiosInstance";
import { useRouter } from "next/navigation";

// Create context with default value
export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface IUserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FunctionComponent<IUserProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = React.useState<UserType | null>(null);

  const keepLogin = async () => {
    try {
      const { data } = await apiCall.get("/auth/keepLogin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });
      localStorage.setItem("auth", data.result.token);
      setUser({ email: data.result.email, noTelp: data.result.noTelp });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (localStorage.getItem("auth")) {
      keepLogin();
    }
  }, []);

  // const [onCheck, setOnCheck] = React.useState<boolean>(true);

  // const checkAuth = () => {
  //   const keepLogin = localStorage.getItem("auth");
  //   console.log(keepLogin);
  //   if (!keepLogin) {
  //     router.push("/login");
  //     setTimeout(() => {
  //       setOnCheck(false);
  //     }, 1500);
  //   }
  // };

  // React.useEffect(() => {
  //   checkAuth();
  // }, []);

  // if (onCheck) {
  //   return <p className="text-center"> LOADING </p>;
  // }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
