'use client';
import { createContext, useState } from "react";

export const ClinicalRecordContext = createContext();
export default function ClinicalRecordProvider({children}){
    const [refresh,setRefresh] = useState(false);
    return(
        <ClinicalRecordContext.Provider value={{refresh,setRefresh}}>
            {children}
        </ClinicalRecordContext.Provider>
    )
}