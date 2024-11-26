import React, { createContext, useState, ReactNode } from "react";

interface RefreshContextProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

export const RefreshContext = createContext<RefreshContextProps>({
  refresh: false,
  setRefresh: () => {},
});

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState<boolean>(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
