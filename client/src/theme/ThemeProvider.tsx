import React, { useEffect, useRef, useState } from "react";
import { Theme, Resolved, ThemeContext } from "./ThemeContext";
import { getItem, setItem } from "./storage";

export const THEME_SYSTEM: Theme = "system";
export const THEME_DARK: Resolved = "dark";
export const THEME_LIGHT: Resolved = "light";

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mqRef = useRef<MediaQueryList | null>(
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null
  );

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return getItem<Theme>("theme") ?? THEME_SYSTEM;
    } catch {
      return THEME_SYSTEM;
    }
  });

  const [systemDark, setSystemDark] = useState<boolean>(
    () => !!mqRef.current?.matches
  );

  const resolvedTheme: Resolved =
    theme === THEME_SYSTEM ? (systemDark ? THEME_DARK : THEME_LIGHT) : theme;

  useEffect(() => {
    const mql = mqRef.current;
    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.style.setProperty("--marker-color", "#2a2c30");
  }, [resolvedTheme]);

  useEffect(() => {
    setItem<Theme>("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "theme") return;
      try {
        setTheme(e.newValue ? (JSON.parse(e.newValue) as Theme) : THEME_SYSTEM);
      } catch {
        setTheme(THEME_SYSTEM);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () =>
    setTheme(resolvedTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
