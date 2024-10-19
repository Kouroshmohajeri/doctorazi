'use client';
import SideMenu from '@/components/SideMenu/SideMenu'
import React, { useContext, useEffect, useState } from 'react';
import WindowIcon from '@mui/icons-material/Window';
import { EventAvailable } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import Groups2Icon from '@mui/icons-material/Groups2';
import { sideMenuContext } from '@/context/SideMenuContext';
import DoctorPanel from '@/components/Panels/DoctorPanel/DoctorPanel';
import ClinicalRecords from '@/components/ClinicalRecords/ClinicalRecords';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UserTable from '@/components/UserTable/UserTable';
import Patients from '@/components/Patients/Patients';
import { UserDataContext } from '@/context/UserDatasContext';
import { getFullNameById } from '@/lib/actions/users/actions';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import Prescriptions from '@/components/Prescriptions/Prescriptions';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import Biography from '@/components/Biography/Biography';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import DoctorCalendar from '@/components/DoctorCalendar/DoctorCalendar';

const Page = () => {
  const [doctorName, setDoctorName] = useState();
  const {users,fetchCookies} = useContext(UserDataContext);
  useEffect(()=>{
    fetchCookies();
  },[]);
  useEffect(()=>{
    const fetchName = async()=>{
      try {
        let response;
        if (users.id) {
          response = await getFullNameById(users.id);
          setDoctorName(response.fullName);
        }
      } catch (error) {
        console.log("Error fetching doctor's name!". error)
      }
    }
    fetchName()
  },[users.id,fetchCookies])
  const {isSelected} = useContext(sideMenuContext);
  const renderSelectedPanel = () => {
    switch (isSelected) {
      case 0:
        return <DoctorPanel />;
      case 1:
        return <UserTable />;
      case 2:
        return <ClinicalRecords folder={'prescription'} prefix={'pr_'}/>;
      case 3:
        return <Patients />;
      case 4: 
        return <Prescriptions/>
      case 5: 
        return <Biography/>
      case 6: 
        return <DoctorCalendar/>
      default:
        return null; 
    }
  };
  return (
    <main>
      <SideMenu heading={`Welcome Dr.${doctorName} `} menuList={
        [{ text: "Panel", icon: <WindowIcon /> },
        { text: "Appointments", icon: <EventAvailable /> },
        { text: "Clinical Records", icon: <FolderIcon /> },
        { text: "Patients", icon: <Groups2Icon /> },
        { text:"Prescriptions", icon:<DescriptionSharpIcon/> },
        { text:"Resume", icon:<AssignmentIndSharpIcon/> },
        { text:"Calendar", icon:<CalendarMonthSharpIcon/> },
        ]
      }>
        {renderSelectedPanel()}
      </SideMenu>
    </main>
  )
}

export default Page;
