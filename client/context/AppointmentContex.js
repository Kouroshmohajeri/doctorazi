"use client";
import React, { useState, createContext } from 'react';

export const AppointmentContext = createContext();

const AppointmentContextProvider = ({ children }) => {
    const [doctor, setDoctor] = useState({ id: '', name: '' });
    const [speciality, setSpeciality] = useState({ id: '', name: '' });
    const [date, setDate] = useState({ gregorian: '', jalali: '' });
    const [time, setTime] = useState('');
    const [calendarId,setCalendarId] = useState(0);

    const values = {
        doctor,
        setDoctor,
        speciality,
        setSpeciality,
        date,
        setDate,
        time,
        setTime,
        calendarId,
        setCalendarId,
    };

    return (
        <AppointmentContext.Provider value={values}>
            {children}
        </AppointmentContext.Provider>
    );
};

export default AppointmentContextProvider;
