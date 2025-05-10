"use client";

import { createTheme, TextField } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import UseLocalStorageState from "../hooks/useLocalStorage";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else if (theme === "light") {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
    } else {
      localStorage.setItem("theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    switch (darkMode) {
      case true:
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
        console.log("dark: ", true);
        break;
      case false:
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
        setDarkMode(true);
        console.log("dark: ", false);
        break;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  return useContext(ThemeContext);
};

export { ThemeContextProvider, useTheme };
