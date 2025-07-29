
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [doctorId, setDoctorId] = useState(null);
  const[appid,setAppid] = useState('');


  return (
    <AuthContext.Provider value={{ doctorId, setDoctorId,appid,setAppid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
