"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export const ThemeProvider = ({ children, ...props }: Omit<ThemeProviderProps, "forcedTheme" | "defaultTheme">) => {
  return (
    <NextThemesProvider {...props} forcedTheme="dark" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
};
