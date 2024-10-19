import React from 'react';
import styles from './DoctorPanel.module.css';
import DashboardCard from '../../DashboardCard/DashboardCard';
import WalletIcon from '@mui/icons-material/Wallet';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import Groups2Icon from '@mui/icons-material/Groups2';

const DoctorPanel = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <DashboardCard heading={'Total Earnings'} icon={<WalletIcon/>} details={'1,000,000 T'} bgImage={'/images/koy7.jpg'}/>
        <DashboardCard heading={'Total Number of Appointments:'} icon={<BookmarkAddedIcon/>} details={'15'} bgImage={'/images/jgj3.jpg'}/>
      </div>
      <div className={styles.dashboard}>
        <DashboardCard heading={'You have'} icon={<Groups2Icon/>} details={'10 patients'} bgImage={'/images/60286.jpg'}/>
      </div>
    </>
  )
}

export default DoctorPanel
