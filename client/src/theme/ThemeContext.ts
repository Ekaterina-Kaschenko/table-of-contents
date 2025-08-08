import { createContext } from "react";

export type Theme = "light" | "dark" | "system";
export type Resolved = "light" | "dark";

export type ThemeCtx = {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeCtx | undefined>(undefined);
