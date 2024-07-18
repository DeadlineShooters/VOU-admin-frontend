import React, { createContext, useState, useEffect, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const userData = JSON.parse(secureLocalStorage.getItem("user"));
  console.log("User data from storage: ", userData);
  return <AuthContext.Provider value={{ user, userData, isLogged, setUser, setIsLogged }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
