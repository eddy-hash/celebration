'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { applyTheme, type ThemeMode } from '@/lib/themes';

interface ThemeCtx {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    const initial: ThemeMode = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setThemeState(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    applyTheme(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', t);
    }
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Prevent flash: hide until theme is applied
  if (!ready) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be inside ThemeProvider');
  return c;
}
