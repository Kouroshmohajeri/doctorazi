'use client'
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const dimensionContext = createContext();

const DimensionContextProvider = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState(false);

    const checkWindowSize = useCallback(() => {
        let windowWidth = 0; 
        if (typeof window !== 'undefined') {
            windowWidth = window.innerWidth;
        }
        setIsDesktop(windowWidth >= 1024);
        return windowWidth;
    }, []);
    useEffect(() => {
      window.addEventListener('resize', checkWindowSize);
      // Initial check on mount
      checkWindowSize();
      
      // Cleanup
      return () => window.removeEventListener('resize', checkWindowSize);
    }, [checkWindowSize]); 
    return (
        <dimensionContext.Provider value={{ checkWindowSize, isDesktop }}>
            {children}
        </dimensionContext.Provider>
    );
};

export default DimensionContextProvider;
