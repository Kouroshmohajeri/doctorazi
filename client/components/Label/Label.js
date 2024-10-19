import React from "react";
import styles from "./Label.module.css";
const Label = ({ children, currentLang }) => {
  return (
    <label
      className={
        currentLang === "fa" ? `${styles.labelFa}` : `${styles.labelEn}`
      }
    >
      {children}
    </label>
  );
};

export default Label;
