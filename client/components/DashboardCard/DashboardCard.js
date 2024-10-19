import React from 'react';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ heading, icon, details, bgImage }) => {
  const cardStyle = bgImage ? { backgroundImage: `url(${bgImage})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } : { backgroundColor: 'white' };

  return (
    <div className={styles.card} style={cardStyle}>
      <h3 className={styles.heading}>{heading}</h3>
      <div className={styles.info}>
        <span className={styles.icon}>
          {icon}
        </span>
        <h2 className={styles.details}>{details}</h2>
      </div>
    </div>
  );
};

export default DashboardCard;
