'use client';
import {React, createContext, useState} from 'react'

export const translateContext = createContext();
const TranslateModeProvider = ({children}) => {
    const [isTranslateModeOn, setIsTranslateModeOn] = useState(false);
    
  return (
    <translateContext.Provider value={{isTranslateModeOn ,setIsTranslateModeOn}}>
      {children}
    </translateContext.Provider>
  )
}

export default TranslateModeProvider;
