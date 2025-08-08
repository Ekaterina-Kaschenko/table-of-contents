import React, { useEffect, useState } from "react";
import { Theme, Resolved, ThemeContext } from "./ThemeContext";

export const THEME_SYSTEM: Theme = "system";
export const THEME_DARK: Resolved = "dark";
export const THEME_LIGHT: Resolved = "light";

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || THEME_SYSTEM
  );

  const [systemDark, setSystemDark] = useState(
    () =>
      window.matchMedia?.(`(prefers-color-scheme: ${THEME_DARK})`).matches ??
      false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const resolvedTheme: Resolved =
    theme === THEME_SYSTEM ? (systemDark ? THEME_DARK : THEME_LIGHT) : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") setTheme((e.newValue as Theme) || THEME_SYSTEM);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () =>
    setTheme(resolvedTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK);

  const value = { theme, resolvedTheme, setTheme, toggle };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
