"use client";

const { createContext, useState } = require("react");

export const NavContext = createContext();

const NavContextProvider = ({ children }) => {
  const [isCSCOpen, setIsCSCOpen] = useState(false);
  const [isESCOpen, setIsESCOpen] = useState(false);

  const value = {
    isCSCOpen,
    setIsCSCOpen,
    isESCOpen,
    setIsESCOpen,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export default NavContextProvider;
