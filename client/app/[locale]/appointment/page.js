import Appointment from '@/components/Appointment/Appointment';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import React from 'react';
import styles from './appointment.module.css';

const page = () => {
  return (
    <>
        <Header/>
        <div className={styles.appointment}>
            <Appointment/>
        </div>
        <Footer/>
    </>
  )
}

export default page
