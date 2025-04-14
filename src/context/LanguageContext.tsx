
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { englishTranslations } from "../i18n/en";
import { portugueseTranslations } from "../i18n/pt-BR";

type LanguageCode = "en" | "pt-BR";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Try to get the language from localStorage or default to English
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem("zenta-language") as LanguageCode;
    return savedLanguage || "en";
  });

  // Get the translations for the current language
  const translations = language === "pt-BR" ? portugueseTranslations : englishTranslations;

  // Function to get a translation by key
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  };

  // Set language and save to localStorage
  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("zenta-language", code);
  };

  // Provide language context to the entire app
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
