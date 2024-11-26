import React, { createContext, useState, ReactNode } from "react";

interface RefreshContextProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  toggleRefresh: () => void;
}

export const RefreshContext = createContext<RefreshContextProps>({
  refresh: false,
  setRefresh: () => {},
  toggleRefresh: () => {},
});

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState<boolean>(false);

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh, toggleRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
