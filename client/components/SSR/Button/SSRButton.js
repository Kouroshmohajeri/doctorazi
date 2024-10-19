'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import CalendarModal from '../CalendarModal/CalendarModal';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';
import CircularProgress from '@mui/material/CircularProgress';

const SSRButton = ({ children, id, type = null }) => {
    const { refresh, setRefresh } = useContext(ClinicalRecordContext);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const handleLoad = () => {
            setLoading(false);
        };

        // Simulate a load event for demonstration purposes
        setTimeout(handleLoad, 1000); // Replace this with actual load event if needed

        return () => {
            // Cleanup if necessary
        };
    }, []);

    const back = () => {
        router.back();
    };

    const handleAppointment = () => {
        setRefresh(!refresh);
        setOpen(true);
    };

    return (
        <>
            <button 
                className='btn btn-outline-primary' 
                onClick={!type ? handleAppointment : back} 
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : children }
            </button>
            <CalendarModal open={open} setOpen={setOpen} id={id} />
        </>
    );
};

export default SSRButton;
