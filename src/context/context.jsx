// src/context/MyContext.js
import React, { createContext, useState } from 'react';

// Create a context
const MyContext = createContext();


const MyProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

  return (
    <MyContext.Provider value={{ auth, setAuth }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };