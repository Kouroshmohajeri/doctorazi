import React from 'react';
import styles from './ManagementPanel.module.css';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import WalletIcon from '@mui/icons-material/Wallet';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import UserTable from '@/components/UserTable/UserTable';

const ManagementPanel = () => {
  return (
    <>
      <div className={styles.dashboard}>
          <DashboardCard heading={'Total Earnings'} icon={<WalletIcon/>} details={'1,000,000'} bgImage={'/images/koy7.jpg'}/>
          <DashboardCard heading={'Appointments Reserved'} icon={<BookmarkAddedIcon/>} details={'+100'} bgImage={'/images/jgj3.jpg'}/>
      </div>
      <div className={styles.table}>
          <UserTable/>
      </div>
    </>
  )
}

export default ManagementPanel
