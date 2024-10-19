import React from 'react';
import styles from './AuthorPanel.module.css';
import DashboardCard from '../../DashboardCard/DashboardCard';
import WalletIcon from '@mui/icons-material/Wallet';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdd';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';

const AuthorPanel = () => {
  return (
    <>
      <div className={styles.dashboard}>
        <DashboardCard heading={'Total Earnings'} icon={<WalletIcon/>} details={'1,000,000 T'} bgImage={'/images/koy7.jpg'}/>
        <DashboardCard heading={'Your Total Requests'} icon={<BookmarkAddedIcon/>} details={'36'} bgImage={'/images/jgj3.jpg'}/>
      </div>
      <div className={styles.dashboard}>
        <DashboardCard heading={'Processed Post Request'} icon={<ListOutlinedIcon/>} details={'15'} bgImage={'/images/koy7.jpg'}/>
        <DashboardCard heading={'Post Requests Pending'} icon={<AccessTimeFilledOutlinedIcon/>} details={'3'} bgImage={'/images/jgj3.jpg'}/>
      </div>
      <div className={styles.dashboard}>
        <DashboardCard heading={'Processed Translation Request'} icon={<ListOutlinedIcon/>} details={'15'} bgImage={'/images/koy7.jpg'}/>
        <DashboardCard heading={'Translation Requests Pending'} icon={<AccessTimeFilledOutlinedIcon/>} details={'3'} bgImage={'/images/jgj3.jpg'}/>
      </div>
    </>
  )
}

export default AuthorPanel
