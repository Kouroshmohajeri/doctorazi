'use client';
import getHttpOnlyCookies from '@/getCookies';
import decoder from '@/lib/decode';
import React, { createContext, useState } from 'react';

export const UserDataContext = createContext();

export function UserDataProvider({ children }) {
    const [users,setUsers] = useState({
        id:null,
        type:null
    });
    const [appointmentLoggedIn,setAppointmentLoggedIn] = useState(false);
    const fetchCookies = async () => {
        try {
            const token = await getHttpOnlyCookies();
            if (token && token !== 'undefined' && token !== "") {
                const user = await decoder(token);
                if (user.data.user_type===1) {
                    setUsers({ id: user.data.user_id / 8312, type: user.data.user_type, doctors:user.data.doctors });
                }
                else{
                    setUsers({ id: user.data.user_id / 8312, type: user.data.user_type });
                }
            }
        } catch (error) {
            console.error('Failed to fetch token:', error);
        }
    };
    return (
        <UserDataContext.Provider value={{ users, setUsers, fetchCookies, appointmentLoggedIn,setAppointmentLoggedIn }}>
        {children}
        </UserDataContext.Provider>
    );
}