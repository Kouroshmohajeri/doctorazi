import React from 'react';
import styles from './TranslatorPanel.module.css';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import DashboardCard from '../../DashboardCard/DashboardCard';
import WalletIcon from '@mui/icons-material/Wallet';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';

const TranslatorPanel = () => {
  return (
    <>
        <div className={styles.dashboard}>
            <DashboardCard heading={'Total Earnings'} icon={<WalletIcon/>} details={'1,000,000'} bgImage={'/images/koy7.jpg'}/>
            <DashboardCard heading={'Total Translations'} icon={<ChecklistOutlinedIcon/>} details={'16'} bgImage={'/images/jgj3.jpg'}/>
        </div>
        <div className={styles.dashboard}>
            <DashboardCard heading={'Requests From Head Author'} icon={<SmsOutlinedIcon/>} details={'2'} bgImage={'/images/koy7.jpg'}/>
            <DashboardCard heading={'Total Translations'} icon={<ChecklistOutlinedIcon/>} details={'16'} bgImage={'/images/jgj3.jpg'}/>
        </div>
    </>
  )
}

export default TranslatorPanel
