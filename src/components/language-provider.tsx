"use client";

import * as React from "react";
import {
  type Locale,
  type Dictionary,
  dictionaries,
  defaultLocale,
} from "@/locales";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "nexus-pulse-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);

  // Read saved locale on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === "es" || saved === "en")) {
        setLocaleState(saved);
      } else {
        // Fallback to browser language
        const browserLang = navigator.language?.toLowerCase();
        if (browserLang.startsWith("en")) {
          setLocaleState("en");
        }
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Storage unavailable
    }
  }, []);

  const toggleLocale = React.useCallback(() => {
    setLocale(locale === "es" ? "en" : "es");
  }, [locale, setLocale]);

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: dictionaries[locale] || dictionaries[defaultLocale],
    }),
    [locale, setLocale, toggleLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
