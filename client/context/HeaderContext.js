import React, { createContext, useState } from 'react'
export const HeaderContext = createContext();
const HeaderContextProvider = ({children}) => {
    const [headerSelected,setHeaderSelected] = useState(0);
  return (
    <HeaderContext.Provider value={{headerSelected,setHeaderSelected}}>
      {children}
    </HeaderContext.Provider>
  )
}

export default HeaderContextProvider
