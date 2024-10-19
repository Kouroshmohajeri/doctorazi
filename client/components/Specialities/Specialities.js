"use client";
import Image from "next/legacy/image";
import { React, useContext } from "react";
import styles from "./Specialities.module.css";
import Link from "next/link";
import Label from "../Label/Label";
import { languageContext } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

const Specialities = () => {
  const { t, currentLang } = useContext(languageContext);
  const router = useRouter();
  return (
    <div className={styles.SpecialitiesContainer}>
      <Label currentLang={currentLang}>{t("Labels:Specialities")}</Label>
      <div
        className={
          currentLang === "fa" ? `${styles.cardFa}` : `${styles.cardEn}`
        }
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-md-3 col-lg-3">
              <div className={styles.Specialities}>
                <Link href="/">
                  <Image
                    src="/images/AzadehHosseini.png"
                    alt="AzadehHosseini"
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className={styles.guide}>
                    <span>{t("Specialities:Gynecologist")}</span>
                    <br />
                    <span>{t("Doctors:AzadeHosseini")}</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-sm-6 col-md-9 col-lg-9">
              <div className={styles.browse}>
                <Image
                  src="/images/timeline2.jpg"
                  alt="BrowsingDoctors"
                  layout="fill"
                  objectFit="cover"
                />
                <div className={styles.overlay}></div>
                <div className={styles.text}>
                  <p>{t("Specialities:FindDoctor")}</p>
                  <button
                    onClick={() => {
                      router.push("/doctors");
                    }}
                  >
                    {t("Specialities:AllDoctors")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialities;
