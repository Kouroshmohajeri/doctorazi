'use client';
import {React, createContext, useState} from 'react'

export const sideMenuContext = createContext();
const SideMenuProvider = ({children}) => {
    const [isSelected, setIsSelected] = useState(0);
    
  return (
    <sideMenuContext.Provider value={{isSelected,setIsSelected}}>
      {children}
    </sideMenuContext.Provider>
  )
}

export default SideMenuProvider;
