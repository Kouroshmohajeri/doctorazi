import React from 'react';
import DashboardCard from '../../DashboardCard/DashboardCard';
import ArticleIcon from '@mui/icons-material/Article';
import WalletIcon from '@mui/icons-material/Wallet';
import styles from './WriterPanel.module.css';
import DoDisturbOffOutlinedIcon from '@mui/icons-material/DoDisturbOffOutlined';

const WriterPanel = () => {
  return (
    <>
        <div className={styles.dashboard}>
            <DashboardCard heading={'Total Earnings'} icon={<WalletIcon/>} details={'1,000,000'} bgImage={'/images/koy7.jpg'}/>
            <DashboardCard heading={"My Posts"} details={"11"} icon={<ArticleIcon/>} bgImage={'/images/koy7.jpg'}/>
        </div>
        <div className={styles.dashboard}>
            <DashboardCard heading={"Post Request"} details={"2"} icon={<ArticleIcon/>} bgImage={'/images/koy7.jpg'}/>
            <DashboardCard heading={"Rejected Posts"} details={"0"} icon={<DoDisturbOffOutlinedIcon/>} bgImage={'/images/koy7.jpg'}/>
        </div>
    </>
  )
}

export default WriterPanel
