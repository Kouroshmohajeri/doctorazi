'use client'
import SideMenu from '@/components/SideMenu/SideMenu'
import React, { useContext } from 'react'
import { sideMenuContext } from '@/context/SideMenuContext';
import ManagementPanel from '@/components/Panels/ManagementPanel/ManagementPanel';
import HirePanel from '@/components/Panels/HirePanel/HirePanel';
import ClinicalRecords from '@/components/ClinicalRecords/ClinicalRecords';
import PostsManagement from '@/components/BlogsManagement/PostsManagement';
import ArticleIcon from '@mui/icons-material/Article';
import TranslateIcon from '@mui/icons-material/Translate';
import FolderIcon from '@mui/icons-material/Folder';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WindowIcon from '@mui/icons-material/Window';
import { EventAvailable } from '@mui/icons-material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import UserTable from '@/components/UserTable/UserTable';
import PolicySharpIcon from '@mui/icons-material/PolicySharp';
import DocumentsManager from '@/components/DocumentManager/DocumentManager';

const Page = () => {
  const { isSelected } = useContext(sideMenuContext);
  

  const renderSelectedPanel = () => {
    switch (isSelected) {
      case 0:
        return <ManagementPanel />;
      case 1:
        return <HirePanel />;
      case 2:
        return <UserTable />;
      case 3:
        return <ClinicalRecords />;
      case 4:
        return <PostsManagement heading={'Blog Posts'} />;
      case 5:
        return <PostsManagement heading={'Untranslated Posts'} />;
      case 6:
        return <DocumentsManager />;
      default:
        return null;
    }
  };

  return (
    <main>
      <SideMenu heading={`Management - Welcome `} menuList={[
        { text: "Panel", icon: <WindowIcon /> },
        { text: "Hire", icon: <PersonAddAlt1Icon/> },
        { text: "Appointments", icon: <EventAvailable /> },
        { text: "Clinical Records", icon: <FolderIcon /> },
        { text: "Blog", icon: <ArticleIcon /> },
        { text: "Translation", icon: <TranslateIcon /> },
        { text: "Documents", icon: <PolicySharpIcon /> },
      ]}>
        {renderSelectedPanel()}
      </SideMenu>
    </main>
  );
};

export default Page;
