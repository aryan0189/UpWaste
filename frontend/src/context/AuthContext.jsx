import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on first load
    const storedUser = localStorage.getItem("upwaste-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("upwaste-user");
  };

  // Sync localStorage in case of changes from other tabs/windows
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("upwaste-user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
