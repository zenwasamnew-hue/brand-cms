'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'midnight' | 'silver' | 'space-gray' | 'matrix' | 'sunset' | 'aurora';

export const themes: { value: Theme; label: string; swatch: string }[] = [
  { value: 'midnight', label: 'Midnight', swatch: '#0A84FF' },
  { value: 'silver',   label: 'Silver',   swatch: '#8E8E93' },
  { value: 'space-gray', label: 'Space Gray', swatch: '#636366' },
  { value: 'matrix',   label: 'Matrix',   swatch: '#00FF41' },
  { value: 'sunset',   label: 'Sunset',   swatch: '#FF9F0A' },
  { value: 'aurora',   label: 'Aurora',   swatch: '#BF5AF2' },
];

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'midnight',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('midnight');

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme') as Theme | null;
    const initial = stored ?? 'midnight';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('admin-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
