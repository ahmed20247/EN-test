"use client";

import { ThemeContext, useTheme } from "@/contexts/theme-context";
import useDarkMode from "../../hooks/useDarkMode";
import { DarkMode, LightMode, Mode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext } from "react";

export default function ThemeMode() {
  const { toggleTheme, darkMode } = useTheme();

  return (
    <div className="fixed right-8 bottom-20">
      <IconButton onClick={toggleTheme}>
        {darkMode ? (
          <LightMode sx={{ color: "#435d82", fontSize: "2rem" }} />
        ) : (
          <DarkMode sx={{ color: "#435d82", fontSize: "2rem" }} />
        )}
      </IconButton>
    </div>
  );
}
