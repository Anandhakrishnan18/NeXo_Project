import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";

export default function ThemeCard() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      if (savedSettings.theme) {
        setTheme(savedSettings.theme);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    try {
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      savedSettings.theme = newTheme;
      localStorage.setItem("settings", JSON.stringify(savedSettings));

      if (newTheme === "light" || (newTheme === "system" && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.body.setAttribute("data-theme", "light");
      } else {
        document.body.removeAttribute("data-theme");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="settings-module-card">
      <div className="settings-module-header">
        <Palette size={20} />
        Theme Preferences
      </div>
      <div className="settings-theme-options">
        <div
          className={`theme-option ${theme === "dark" ? "active" : ""}`}
          onClick={() => handleThemeChange("dark")}
        >
          <Moon size={24} />
          <span>Dark Theme</span>
        </div>
        <div
          className={`theme-option ${theme === "light" ? "active" : ""}`}
          onClick={() => handleThemeChange("light")}
        >
          <Sun size={24} />
          <span>Light Theme</span>
        </div>
        <div
          className={`theme-option ${theme === "system" ? "active" : ""}`}
          onClick={() => handleThemeChange("system")}
        >
          <Monitor size={24} />
          <span>System Theme</span>
        </div>
      </div>
    </div>
  );
}
