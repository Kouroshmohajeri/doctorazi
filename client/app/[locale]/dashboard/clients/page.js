"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Clients.module.css";
import SideMenu from "@/components/SideMenu/SideMenu";
import ClinicalRecords from "@/components/ClinicalRecords/ClinicalRecords";
import UserTable from "@/components/UserTable/UserTable";
import FolderIcon from "@mui/icons-material/Folder";
import WindowIcon from "@mui/icons-material/Window";
import { EventAvailable } from "@mui/icons-material";
import WalletIcon from "@mui/icons-material/Wallet";
import { sideMenuContext } from "@/context/SideMenuContext";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import ClientPanel from "@/components/Panels/ClientPanel/ClientPanel";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BottomSpeedDial from "@/components/SpeedDial/SpeedDial";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import Prescriptions from "@/components/Prescriptions/Prescriptions";
import { UserDataContext } from "@/context/UserDatasContext";
import { getDoctorCount, getFullNameById } from "@/lib/actions/users/actions";
import DoctorsList from "@/components/DoctorsList/DoctorsList";
import MasksSharpIcon from "@mui/icons-material/MasksSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import Groups2SharpIcon from "@mui/icons-material/Groups2Sharp";

const Page = () => {
  const { isSelected } = useContext(sideMenuContext);
  const { users, fetchCookies } = useContext(UserDataContext);
  const [name, setName] = useState("");
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [cookiesFetched, setCookiesFetched] = useState(false);

  // Use effect to fetch cookies once
  useEffect(() => {
    if (!cookiesFetched) {
      fetchCookies();
      setCookiesFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookiesFetched]);

  // Use effect to fetch user data based on `users.id`
  useEffect(() => {
    const fetchName = async () => {
      try {
        if (users.id) {
          const response = await getFullNameById(users.id);
          setName(response.fullName);
          const count = await getDoctorCount(users.id);
          setDoctorsCount(count);
        }
      } catch (error) {
        console.log("Error fetching doctor's name!", error);
      }
    };
    fetchName();
  }, [users.id]);

  const renderSelectedPanel = () => {
    switch (isSelected) {
      case 0:
        return <ClientPanel />;
      case 1:
        return <UserTable />;
      case 2:
        return <ClinicalRecords folder={"crecord"} prefix={"cr_"} />;
      case 3:
        return <Prescriptions />;
      case 4:
        return <DoctorsList userId={users.id} />;
      default:
        return null;
    }
  };

  const getDoctorIcon = (count) => {
    if (count === 0 || count === 1) {
      return <MasksSharpIcon />;
    } else if (count === 2) {
      return <GroupSharpIcon />;
    } else {
      return <Groups2SharpIcon />;
    }
  };

  const actions = [
    { icon: <AddOutlinedIcon />, name: "New Appointment", code: 2 },
    {
      icon: <CreateNewFolderOutlinedIcon />,
      name: "Add Clinical Record",
      code: 3,
    },
  ];

  return (
    <main className={styles.main}>
      <SideMenu
        heading={name ? `Welcome ${name} ` : "Loading... "}
        menuList={[
          { text: "Panel", icon: <WindowIcon /> },
          { text: "Appointments", icon: <EventAvailable /> },
          { text: "My Clinical Records", icon: <FolderIcon /> },
          { text: "My Prescriptions", icon: <DescriptionSharpIcon /> },
          {
            text: `My ${doctorsCount > 1 ? "Doctors" : "Doctor"}`,
            icon: getDoctorIcon(doctorsCount),
          },
        ]}
      >
        {renderSelectedPanel()}
        <BottomSpeedDial actions={actions} />
      </SideMenu>
    </main>
  );
};

export default Page;
