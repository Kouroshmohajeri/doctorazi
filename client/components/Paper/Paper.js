"use client";
import React from "react";
import styles from "./Paper.module.css";

const Paper = ({
  image,
  title,
  desc,
  imageHeight = "30%",
  imageWidth = "80%",
}) => {
  const parsedHeight = imageHeight;
  const parsedWidth = imageWidth;

  return (
    <div className={styles.paperContainer}>
      <div className={styles.image}>
        <img
          src={`https://doctorazi.com/api/blogs/${image}`}
          alt={title}
          style={{
            width: parsedWidth,
            height: parsedHeight,
            objectFit: "cover",
            borderRadius: "15px",
          }}
          loading="lazy"
        />
      </div>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default Paper;
