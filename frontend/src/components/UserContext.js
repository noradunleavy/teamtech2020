import React, { createContext, useState } from "react";

export const UserContext = createContext();

// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [uuid, setUuid] = useState("5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe");

  return (
    <UserContext.Provider
      value={{
        uuid,  
        setUuid
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
