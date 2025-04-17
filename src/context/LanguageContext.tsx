
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { portugueseTranslations } from "../i18n/pt-BR";

type LanguageCode = "pt-BR";

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
  // Define o português como idioma padrão
  const [language, setLanguageState] = useState<LanguageCode>("pt-BR");

  // Obtem as traduções para o idioma atual
  const translations = portugueseTranslations;

  // Função para obter uma tradução por chave
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

  // Define o idioma
  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("zenta-language", code);
  };

  // Fornece o contexto de idioma para toda a aplicação
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
