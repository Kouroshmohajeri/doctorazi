"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styles from './DoctorPicker.module.css';
import { useContext, useEffect, useState } from 'react';
import { AppointmentContext } from '@/context/AppointmentContex';
import { listSpecialities } from '@/lib/actions/speciality/actions';
import { getDoctorBySpecialityId } from '@/lib/actions/doctors/actions';

export default function DoctorPicker() {
    const { setDoctor, setSpeciality, speciality, doctor } = useContext(AppointmentContext);
    const [open, setOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        async function fetchSpecialities() {
            const specialities = await listSpecialities();
            setSpecialities(specialities.map(spec => ({
                value: spec.speciality_id,
                label: spec.name
            })));
        }

        fetchSpecialities();
    }, []);

    const handleChangeSpeciality = async (event) => {
        setDoctor({id:"",name:""})
        const selectedSpeciality = event.target.value;
        const selectedSpecialityName = event.target.options[event.target.selectedIndex].text;
        setSpeciality({
            id: selectedSpeciality,
            name: selectedSpecialityName
        });

        if (selectedSpeciality) {
            setDoctorLoading(true);
            try {
                const response = await getDoctorBySpecialityId(selectedSpeciality);
                if (response && response.doctors) {
                    const doctors = response.doctors.map(doc => ({
                        value: doc.doctor_id,
                        label: `${doc.ClientDetails.first_name} ${doc.ClientDetails.last_name}`
                    }));
                    setDoctors(doctors);

                    if (doctors.length === 0) {
                        setSnackbarOpen(true);
                    }
                } else {
                    setDoctors([]);
                    setSnackbarOpen(true);
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setDoctors([]);
                setSnackbarOpen(true);
            } finally {
                setDoctorLoading(false);
            }
        } else {
            setDoctors([]);
        }
    };

    const handleChangeDoctor = (event) => {
        setDoctor({
            id: event.target.value,
            name: event.target.options[event.target.selectedIndex].text,
        });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };

    return (
        <div className={styles.container}>
            <Button onClick={handleClickOpen} variant="outlined">
                {doctor && speciality ? "Click here to change the doctor" : "Click here to select doctor"}
            </Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Fill the form</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel htmlFor="speciality-select">Speciality</InputLabel>
                            <Select
                                native
                                value={speciality.id || ''}
                                onChange={handleChangeSpeciality}
                                input={<OutlinedInput label="Speciality" id="speciality-select" />}
                            >
                                <option aria-label="None" value="" />
                                {specialities.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel htmlFor="doctor-select">Doctor</InputLabel>
                            {doctorLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Select
                                    native
                                    value={doctor.id || ''}
                                    onChange={handleChangeDoctor}
                                    disabled={!speciality.id || doctorLoading}
                                    input={<OutlinedInput label="Doctor" id="doctor-select" />}
                                >
                                    <option aria-label="None" value="" />
                                    {doctors.map((doctor, index) => (
                                        <option key={index} value={doctor.value}>{doctor.label}</option>
                                    ))}
                                </Select>
                            )}
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleOk}>Ok</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                    No doctors available for the selected speciality.
                </Alert>
            </Snackbar>
        </div>
    );
}
