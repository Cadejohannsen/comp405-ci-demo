"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, X, Palette, Monitor, Search, Zap, Contrast } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetTheme = (theme: "light" | "medium" | "dark") => {
    const brightness = theme === "light" ? 5 : theme === "medium" ? 25 : 70;
    updateSettings({ presetTheme: theme, backgroundBrightness: brightness });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-accent transition-colors"
        title="Settings"
      >
        <Settings size={16} />
        <span className="hidden md:inline">Settings</span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-background border-2 border-black shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/10">
            <h2 className="font-heading text-lg font-bold uppercase tracking-tight">
              Settings
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Background Settings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette size={16} />
                <h3 className="font-medium uppercase tracking-wider text-sm">Background</h3>
              </div>
              
              {/* Preset Themes */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handlePresetTheme("light")}
                  className={`flex-1 py-2 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
                    settings.presetTheme === "light"
                      ? "bg-black text-white"
                      : "border-black/20 hover:bg-black/10"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handlePresetTheme("medium")}
                  className={`flex-1 py-2 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
                    settings.presetTheme === "medium"
                      ? "bg-black text-white"
                      : "border-black/20 hover:bg-black/10"
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => handlePresetTheme("dark")}
                  className={`flex-1 py-2 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
                    settings.presetTheme === "dark"
                      ? "bg-black text-white"
                      : "border-black/20 hover:bg-black/10"
                  }`}
                >
                  Dark
                </button>
              </div>

              {/* Brightness Slider */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Brightness: {settings.backgroundBrightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.backgroundBrightness}
                  onChange={(e) => {
                    updateSettings({ 
                      backgroundBrightness: parseInt(e.target.value),
                      presetTheme: "custom"
                    });
                  }}
                  className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Light</span>
                  <span>Dark</span>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Monitor size={16} />
                <h3 className="font-medium uppercase tracking-wider text-sm">Display</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Font Size
                  </label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value as "small" | "medium" | "large" })}
                    className="w-full px-3 py-2 border border-black/20 text-sm bg-background focus:outline-none focus:border-black"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Card Density
                  </label>
                  <select
                    value={settings.cardDensity}
                    onChange={(e) => updateSettings({ cardDensity: e.target.value as "compact" | "normal" | "spacious" })}
                    className="w-full px-3 py-2 border border-black/20 text-sm bg-background focus:outline-none focus:border-black"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider">
                    Show Car Images
                  </label>
                  <button
                    onClick={() => updateSettings({ showCarImages: !settings.showCarImages })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.showCarImages ? "bg-accent" : "bg-black/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-background rounded-full transition-transform ${
                        settings.showCarImages ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search size={16} />
                <h3 className="font-medium uppercase tracking-wider text-sm">Search</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Results Per Page
                  </label>
                  <select
                    value={settings.resultsPerPage}
                    onChange={(e) => updateSettings({ resultsPerPage: parseInt(e.target.value) as 12 | 24 | 48 })}
                    className="w-full px-3 py-2 border border-black/20 text-sm bg-background focus:outline-none focus:border-black"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider">
                    Auto-refresh Results
                  </label>
                  <button
                    onClick={() => updateSettings({ autoRefresh: !settings.autoRefresh })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoRefresh ? "bg-accent" : "bg-black/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-background rounded-full transition-transform ${
                        settings.autoRefresh ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} />
                <h3 className="font-medium uppercase tracking-wider text-sm">Appearance</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    {(["red", "blue", "green", "purple"] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ accentColor: color })}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          settings.accentColor === color ? "border-black" : "border-black/20"
                        }`}
                        style={{
                          backgroundColor:
                            color === "red" ? "#e10600" :
                            color === "blue" ? "#0066cc" :
                            color === "green" ? "#00a652" : "#6b46c1"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Border Radius
                  </label>
                  <select
                    value={settings.borderRadius}
                    onChange={(e) => updateSettings({ borderRadius: e.target.value as "sharp" | "rounded" | "very-rounded" })}
                    className="w-full px-3 py-2 border border-black/20 text-sm bg-background focus:outline-none focus:border-black"
                  >
                    <option value="sharp">Sharp</option>
                    <option value="rounded">Rounded</option>
                    <option value="very-rounded">Very Rounded</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Contrast size={14} />
                    <label className="text-xs font-medium uppercase tracking-wider">
                      High Contrast
                    </label>
                  </div>
                  <button
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.highContrast ? "bg-accent" : "bg-black/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-background rounded-full transition-transform ${
                        settings.highContrast ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-black/10">
              <button
                onClick={resetSettings}
                className="w-full py-2 px-4 text-xs font-medium uppercase tracking-wider border border-black/20 hover:bg-black/10 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
