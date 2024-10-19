import React from 'react';
import Calendar from '../Calendar/Calendar';
import styles from './Appointment.module.css';
import Time from '../Time/Time';
import LevelStepper from '@/components/LevelStepper/LevelStepper';
import DoctorPicker from '../DoctorPicker/DoctorPicker';
import AppointmentContexProvider from '@/context/AppointmentContex';
import PayButton from '../PayButton/PayButton';

const Appointment = () => {
  return (
    <main className={styles.appointment}>
      <AppointmentContexProvider>
        <LevelStepper appointmentSteps={[<DoctorPicker/>,<Calendar/>,<Time/>]} steps = {['Pick a Doctor','Pick a Date', 'Pick Available Time']}/>
      </AppointmentContexProvider>
    </main>
  )
}

export default Appointment
