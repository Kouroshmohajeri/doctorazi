"use client";
import React from "react";
import Image from "next/legacy/image";
import styles from "./Paper.module.css";

const Paper = ({
  image,
  title,
  desc,
  imageHeight = "30%",
  imageWidth = "80%",
}) => {
  const parsedHeight = parseInt(imageHeight.replace("%", ""));
  const parsedWidth = parseInt(imageWidth.replace("%", ""));
  console.log(image);
  return (
    <div className={styles.paperContainer}>
      <div className={styles.image}>
        <Image
          src={image}
          alt={title}
          width={parsedWidth}
          height={parsedHeight}
          layout="responsive"
          className="image"
          priority
          objectFit="cover"
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
