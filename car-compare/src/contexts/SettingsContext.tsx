"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Settings {
  // Background settings
  backgroundBrightness: number; // 0 (white) to 100 (dark)
  presetTheme: "light" | "medium" | "dark" | "custom";
  
  // Display settings
  fontSize: "small" | "medium" | "large";
  cardDensity: "compact" | "normal" | "spacious";
  showCarImages: boolean;
  
  // Search preferences
  defaultSort: string;
  resultsPerPage: 12 | 24 | 48;
  autoRefresh: boolean;
  
  // Appearance
  accentColor: "red" | "blue" | "green" | "purple";
  borderRadius: "sharp" | "rounded" | "very-rounded";
  highContrast: boolean;
}

const defaultSettings: Settings = {
  backgroundBrightness: 10, // Current off-white
  presetTheme: "custom",
  fontSize: "medium",
  cardDensity: "normal",
  showCarImages: true,
  defaultSort: "newest",
  resultsPerPage: 12,
  autoRefresh: false,
  accentColor: "red",
  borderRadius: "rounded",
  highContrast: false,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("car-compare-settings");
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("car-compare-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings]);

  // Apply CSS variables when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Background color based on brightness
    const lightness = 100 - settings.backgroundBrightness;
    const bgColor = `hsl(0, 0%, ${lightness}%)`;
    root.style.setProperty("--background", bgColor);
    
    // Adjust text color for contrast
    const textColor = settings.backgroundBrightness > 50 ? "#ffffff" : "#000000";
    root.style.setProperty("--foreground", textColor);
    
    // Adjust muted colors based on background
    const mutedLightness = settings.backgroundBrightness > 50 
      ? Math.max(20, lightness - 10) 
      : Math.min(90, lightness + 10);
    const mutedColor = `hsl(0, 0%, ${mutedLightness}%)`;
    root.style.setProperty("--muted", mutedColor);
    
    // Border color
    const borderLightness = settings.backgroundBrightness > 50
      ? Math.max(30, lightness - 20)
      : Math.min(80, lightness + 20);
    const borderColor = `hsl(0, 0%, ${borderLightness}%)`;
    root.style.setProperty("--border", borderColor);
    
    // Accent color
    const accentColors = {
      red: "#e10600",
      blue: "#0066cc",
      green: "#00a652",
      purple: "#6b46c1",
    };
    root.style.setProperty("--accent", accentColors[settings.accentColor]);
    
    // Font size
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.setProperty("--font-size-base", fontSizes[settings.fontSize]);
    
    // Border radius
    const borderRadiuses = {
      sharp: "0px",
      rounded: "4px",
      "very-rounded": "12px",
    };
    root.style.setProperty("--border-radius", borderRadiuses[settings.borderRadius]);
    
    // High contrast
    if (settings.highContrast) {
      root.style.setProperty("--foreground", "#000000");
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--border", "#000000");
    }
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
