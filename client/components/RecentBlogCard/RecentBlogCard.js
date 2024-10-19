import React from 'react';
import styles from "./RecentBlogCard.module.css";

const RecentBlogCard = (props) => {
  return (
      <div className='col-sm-6 col-md-6 col-lg-3'>
        <div className={styles.card}>
          {props.children}
        </div>
      </div>
  );
};

export default RecentBlogCard;