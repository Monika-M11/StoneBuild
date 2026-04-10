import React, { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader';

type ContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<ContextType | null>(null);

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used inside LoaderProvider');
  return ctx;
};

export const LoaderProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
};