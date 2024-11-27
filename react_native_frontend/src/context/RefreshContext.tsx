import React, { createContext, useState, ReactNode, useContext } from "react";

interface RefreshContextProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  toggleRefresh: () => void;
}

export const RefreshContext = createContext<RefreshContextProps>({
  refresh: false,
  setRefresh: () => {
    throw new Error("setRefresh must be used within a RefreshProvider");
  },
  toggleRefresh: () => {
    throw new Error("toggleRefresh must be used within a RefreshProvider");
  },
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

export const useRefresh = () => useContext(RefreshContext);
export default RefreshContext;
