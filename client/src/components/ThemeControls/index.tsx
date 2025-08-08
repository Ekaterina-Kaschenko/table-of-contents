import React from "react";
import { Theme, useTheme } from "@/theme";
import "./styles.scss";

const ThemeControls: React.FC = () => {
  const { theme, resolvedTheme, toggle, setTheme } = useTheme();

  return (
    <div className="theme-controls">
      <button
        className="theme-toggle"
        onClick={toggle}
        title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
        aria-label="Toggle color theme"
        type="button"
      >
        {resolvedTheme === "light" ? "🌙" : "☀️"}
      </button>

      <select
        aria-label="Theme"
        className="select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeControls;
