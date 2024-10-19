'use client';
import * as React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import styles from './Time.module.css';
import { useContext, useEffect, useState } from 'react';
import { AppointmentContext } from '@/context/AppointmentContex';
import { getEventsByDoctorIdAndDate, getEventsByDoctorIdAndDateAndTime } from '@/lib/actions/calendar/actions';

dayjs.extend(utc);

export default function Time() {
    const [selectedTime, setSelectedTime] = useState(null);
    const { setTime, date, doctor, calendarId, setCalendarId } = useContext(AppointmentContext);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            try {
                if (date.gregorian && doctor.id) {
                    setLoading(true);
                    const events = await getEventsByDoctorIdAndDate(doctor.id, date.gregorian);
                    const availableEvents = events.filter(event => event.available === "true");
                    const times = availableEvents.map(event => event.time);
                    setAvailableTimes(times);
                }
            } catch (error) {
                console.error('Error fetching available times:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableTimes();
    }, [date.gregorian, doctor.id]);

    const handleTimeSelect = async (time) => {
        setSelectedTime(time);
        setTime(time);
        const calendar = await getEventsByDoctorIdAndDateAndTime(doctor.id,date.gregorian,time);
        setCalendarId(calendar.calendar_id);
    };

    return (
        <div className={styles.container}>
            <div>
                <h2>Available Times</h2>
                <div className={styles.times}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : availableTimes.length > 0 ? (
                        <List component="nav" aria-label="available times">
                            {availableTimes.map((time, index) => (
                                <ListItemButton 
                                    key={index}
                                    selected={selectedTime === time}
                                    onClick={() => handleTimeSelect(time)}
                                >
                                    <ListItemText primary={time} />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <p>No times available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
