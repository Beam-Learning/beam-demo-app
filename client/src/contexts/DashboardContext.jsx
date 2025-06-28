import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <DashboardContext.Provider value={{ selectedAgent, setSelectedAgent }}>
      {children}
    </DashboardContext.Provider>
  );
};
