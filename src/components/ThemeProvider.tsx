import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-school-data";

// Convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Generate color variations
function generateColorVariations(hex: string) {
  const hsl = hexToHSL(hex);
  
  return {
    main: `${hsl.h} ${hsl.s}% ${hsl.l}%`,
    light: `${hsl.h} ${Math.min(hsl.s + 10, 100)}% ${Math.min(hsl.l + 45, 95)}%`,
    dark: `${hsl.h} ${hsl.s}% ${Math.max(hsl.l - 15, 10)}%`,
    glow: `${hsl.h} ${Math.min(hsl.s + 5, 100)}% ${Math.min(hsl.l + 20, 70)}%`,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings?.primary_color && !settings?.accent_color) return;

    const root = document.documentElement;

    // Apply primary color
    if (settings.primary_color) {
      const primary = generateColorVariations(settings.primary_color);
      root.style.setProperty('--primary', primary.main);
      root.style.setProperty('--primary-light', primary.light);
      root.style.setProperty('--primary-dark', primary.dark);
      root.style.setProperty('--primary-glow', primary.glow);
      
      // Also update sidebar and other components that use primary
      root.style.setProperty('--sidebar-primary', primary.main);
      root.style.setProperty('--sidebar-ring', primary.main);
    }

    // Apply accent color
    if (settings.accent_color) {
      const accent = generateColorVariations(settings.accent_color);
      root.style.setProperty('--accent', accent.main);
      root.style.setProperty('--accent-light', accent.light);
      root.style.setProperty('--accent-dark', accent.dark);
      root.style.setProperty('--accent-glow', accent.glow);
      
      // Update sidebar accent
      root.style.setProperty('--sidebar-accent', accent.main);
    }

  }, [settings?.primary_color, settings?.accent_color]);

  return <>{children}</>;
}
