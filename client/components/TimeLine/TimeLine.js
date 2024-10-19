'use client';
import {React,useContext} from 'react';
import styles from "./TimeLine.module.css";
import Image from 'next/legacy/image';
import { languageContext } from '@/context/LanguageContext';

const TimeLine = ({source,headLine}) => {
  const {t} = useContext(languageContext);
  return (
    <div className={styles.Card}>
      <Image
        src={source}
        alt="Timeline"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className={styles.overlay}></div>
      <div className={styles.text}>
        <span>{t(`${headLine}`)}</span>
      </div>
    </div>
  );
};

export default TimeLine;
