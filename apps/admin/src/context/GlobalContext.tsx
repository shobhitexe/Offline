"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useState } from "react";

interface GlobalContextType {
  balance: string | number;
  setBalance: React.Dispatch<React.SetStateAction<string | number>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<string | number>("NaN");

  return (
    <GlobalContext.Provider value={{ balance, setBalance }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
