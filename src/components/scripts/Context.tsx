import { createContext, ReactNode, useState, FC } from "react";

interface AppContextType {
  value: string;
  setValue: (newValue: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const Context: FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState("Initial Value");

  return (
    <AppContext.Provider value={{ value, setValue }}>
      {children}
    </AppContext.Provider>
  );
};
