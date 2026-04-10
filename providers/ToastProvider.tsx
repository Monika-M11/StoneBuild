import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info';

type ToastData = {
  title: string;
  message: string;
  type: ToastType;
};



type ContextType = {
  showToast: (title: string, message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (title: string, message: string, type: ToastType = 'info') => {
    setToast({ title, message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      <View style={styles.toastWrapper}>
        {toast && <Toast {...toast} />}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 50,
    width: '100%',
    zIndex: 999,
  },
});


export default ToastProvider;