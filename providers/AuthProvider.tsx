import { getToken } from '@/auth/authStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  setIsLoggedIn: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // RUN ONLY ONCE (App Start)
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      console.log("Initial Token:", token);

      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);