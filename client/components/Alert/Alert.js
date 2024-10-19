'use client'
import {React, useContext} from 'react';
import styles from './Alert.module.css';
import HandIcon from '../HandIcon/HandIcon';
import { languageContext } from '@/context/LanguageContext';

const Alert = () => {
  const { t, currentLange} = useContext(languageContext);
  return (
    <div className={currentLange==='fa'?`${styles.AlertFa}`:`${styles.AlertEn}`}>
      <div>
        <HandIcon/>
      </div>
      <div>
        <span className={styles.info}>{t('Alert:NewsLetter')}</span>
      </div>
      <div>
        <button>{t('Alert:SignUp')}</button>
      </div>
    </div>
  );
};

export default Alert;