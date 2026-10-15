'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import sw from '@/locales/sw.json';
import en from '@/locales/en.json';

type Lang = 'sw' | 'en';
const DICTS: Record<Lang, any> = { sw, en };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, v?: Record<string, any>) => string;
  ready: boolean;
}

const I18nCtx = createContext<Ctx | null>(null);

function get(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => acc?.[k], obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('sw');
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage AFTER mount — server renders 'sw'
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'sw' || saved === 'en') {
      setLangState(saved);
    }
    setReady(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', l);
      // Notify ALL listeners across the app
      window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
    }
  }, []);

  // Sync across tabs + same-tab events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lang' && (e.newValue === 'sw' || e.newValue === 'en')) {
        setLangState(e.newValue);
      }
    };
    const onLocal = (e: Event) => {
      const d = (e as CustomEvent).detail as Lang | undefined;
      if (d === 'sw' || d === 'en') setLangState(d);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('langchange', onLocal);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('langchange', onLocal);
    };
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, any>) => {
      let text = get(DICTS[lang], key);
      if (text === undefined) text = get(DICTS.sw, key);
      if (text === undefined) text = get(DICTS.en, key);
      if (text === undefined) {
        if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] Missing key: ${key}`);
        }
        return key;
      }
      if (typeof text !== 'string') return key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        }
      }
      return text;
    },
    [lang],
  );

  return (
    <I18nCtx.Provider value={{ lang, setLang, t, ready }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error('useI18n must be inside I18nProvider');
  return c;
}
