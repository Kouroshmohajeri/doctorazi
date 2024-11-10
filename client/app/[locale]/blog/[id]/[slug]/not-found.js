import React from "react";
import styles from "./NotFound.module.css"; // Import the CSS module for styling

const NotFound = () => {
  return (
    <div className={styles.container}>
      <span className={styles.errorCode}>404</span>
      <p className={styles.message}>Page Not Found</p>
      <a href="https://doctorazi.com" className={styles.homeButton}>
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
