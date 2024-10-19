'use client';
import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next';

export const languageContext = createContext();

const LanguageContextProvider = ({children}) => {
    const { t, i18n }  = useTranslation();
    const currentLang = i18n.language; 
  return (
    <languageContext.Provider value={{currentLang,t}}>
      {children}
    </languageContext.Provider>
  )
}

export default LanguageContextProvider
