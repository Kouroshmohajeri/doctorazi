// ClientPanel.js
"use client";
import React, { useContext } from "react";
import styles from "./ClientPanel.module.css";
import DashboardCard from "../../DashboardCard/DashboardCard";
import WalletIcon from "@mui/icons-material/Wallet";
import MasksOutlinedIcon from "@mui/icons-material/MasksOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import { languageContext } from "@/context/LanguageContext";

const ClientPanel = () => {
  const { t, currentLang } = useContext(languageContext);
  return (
    <main className={styles.main}>
      <div className={styles.dashboard}>
        <DashboardCard
          heading={t("Dashboard:MyWallet")}
          icon={<WalletIcon />}
          details={"1,000,000 T"}
          bgImage={"/images/koy7.jpg"}
        />
        <DashboardCard
          heading={t("Dashboard:MyDoctor")}
          icon={<MasksOutlinedIcon />}
          details={"Dr. Azadeh Hosseini"}
          bgImage={"/images/jgj3.jpg"}
        />
      </div>
      <div className={styles.dashboard}>
        <DashboardCard
          heading={t("Dashboard:MyNextAppointment")}
          icon={<CalendarTodayOutlinedIcon />}
          details={"1403 - 02 - 01"}
          bgImage={"/images/koy7.jpg"}
        />
        <DashboardCard
          heading={t("Dashboard:MyClinicalRecords")}
          icon={<FolderIcon />}
          details={t("Dashboard:ClickToBrowse")}
          bgImage={"/images/koy7.jpg"}
        />
      </div>
    </main>
  );
};

export default ClientPanel;
