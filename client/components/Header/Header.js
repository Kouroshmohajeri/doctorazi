"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import LanguageChanger from "../LanguageChanger/LanguageChanger";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { languageContext } from "@/context/LanguageContext";
import { dimensionContext } from "@/context/DimensionContext";

const Header = () => {
  const { t, currentLang } = useContext(languageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { checkWindowSize, isDesktop } = useContext(dimensionContext);
  useEffect(() => {
    const handleResize = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn"));
      checkWindowSize();
    };

    window.addEventListener("resize", handleResize);

    // Initial check to set the correct state based on the current window size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [checkWindowSize]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={
        currentLang === "fa" ? `${styles.HeaderFa}` : `${styles.HeaderEn}`
      }
    >
      <div className="container">
        <div className="row">
          {isDesktop ? (
            <nav className={styles.navbar}>
              <div className="col">
                <div className={styles.headerContainer}>
                  <Link href="/" className={styles.links}>
                    <h1 className={styles.logo}>My Doctor</h1>
                  </Link>
                  <Link href="/doctors" className={styles.links}>
                    {t("Doctors")}
                  </Link>
                  <Link href="/blog" className={styles.links}>
                    {t("Blog")}
                  </Link>
                  <Link href="/" className={styles.links}>
                    {t("AboutUs")}
                  </Link>
                  <Link
                    href="/appointment"
                    className={`${styles.links} ${styles.btnReserve}`}
                  >
                    {t("Appointment")}
                  </Link>
                  <LanguageChanger />
                </div>
              </div>
              <div className="col">
                <div className="container">
                  <div className="row">
                    <div className="col d-flex justify-content-end">
                      <Link
                        href={isLoggedIn ? "/dashboard/clients" : "/login"}
                        className={styles.links}
                      >
                        <button
                          className={`btn btn-outline-dark ${styles.button}`}
                        >
                          {isLoggedIn
                            ? "My Panel"
                            : `${t("LogIn")} / ${t("Register")}`}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          ) : (
            <div className="col-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <IconButton onClick={toggleMenu}>
                  {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className={styles.mobileMenu}
                    >
                      <nav
                        className={
                          currentLang === "fa"
                            ? `${styles.navbarFa}`
                            : `${styles.navbarEn}`
                        }
                      >
                        <Link href="/doctors" className={styles.links}>
                          {t("Doctors")}
                        </Link>
                        <Link href="/blog" className={styles.links}>
                          {t("Blog")}
                        </Link>
                        <Link href="/" className={styles.links}>
                          {t("AboutUs")}
                        </Link>
                        <Link
                          href="/"
                          className={`${styles.links} ${styles.btnReserve}`}
                        >
                          {t("Appointment")}
                        </Link>
                        <div className={styles.languageChanger}>
                          <LanguageChanger />
                        </div>
                        <Link
                          href="/login"
                          className={`${styles.links} ${styles.btnReserve}`}
                        >
                          <button
                            className={`btn btn-outline-dark ${styles.button}`}
                          >
                            {isLoggedIn
                              ? "My Panel"
                              : `${t("LogIn")} / ${t("Register")}`}
                          </button>
                        </Link>
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
