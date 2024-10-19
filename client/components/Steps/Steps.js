"use client";
import { React, useContext } from "react";
import styles from "./Steps.module.css";
import IconButton from "../IconButton/IconButton";
import Link from "next/link";
import { languageContext } from "@/context/LanguageContext";

const Steps = () => {
  const { t, currentLang } = useContext(languageContext);
  return (
    <div
      className={
        currentLang === "fa" ? `${styles.StepsFa}` : `${styles.StepsEn}`
      }
    >
      <div className={styles.guide}>
        <div className={styles.innerGuide}>
          <span>
            <b>{t("Steps:StepOne")}</b>
          </span>
          <Link href="/" className={`${styles.links}`}>
            {t("Steps:InfoOne")}
          </Link>
        </div>
        <div className={styles.innerGuide}>
          <span>
            <b>{t("Steps:StepTwo")}</b>
          </span>
          <p>{t("Steps:InfoTwo")}</p>
        </div>
        <div className={styles.innerGuide}>
          <span>
            <b>{t("Steps:StepThree")}</b>
          </span>
          <p>{t("Steps:InfoThree")}</p>
        </div>
      </div>
      <div
        className={
          currentLang === "fa" ? `${styles.iconFa}` : `${styles.iconEn}`
        }
      >
        <Link href="/appointment">
          <IconButton />
        </Link>
      </div>
    </div>
  );
};

export default Steps;
