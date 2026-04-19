'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { i18n, type Lang, type I18nDict } from '@/lib/i18n';

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: I18nDict;
};

const LangContext = createContext<LangContextType>({
  lang: 'zh',
  setLang: () => {},
  t: i18n.zh,
});

export function useLang() {
  return useContext(LangContext);
}

export default function UiLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    const stored = localStorage.getItem('admin-ui-lang') as Lang | null;
    const valid: Lang[] = ['zh', 'en', 'ja', 'ko'];
    if (stored && valid.includes(stored)) {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('admin-ui-lang', l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: i18n[lang] as unknown as I18nDict }}>
      {children}
    </LangContext.Provider>
  );
}
