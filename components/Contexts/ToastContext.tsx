
'use client'
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
interface DataProviderProps {
  children: ReactNode;
}

interface DataContextType {
  toast: any;
}

export const ToastContext = createContext<DataContextType | null>(null);

const ToastProvider: React.FC<DataProviderProps> = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      { children }
    </ToastContext.Provider>
  );
};

export default ToastProvider;
