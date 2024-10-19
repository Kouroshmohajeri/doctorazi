'use client';
import SideMenu from '@/components/SideMenu/SideMenu'
import { sideMenuContext } from '@/context/SideMenuContext';
import React, { useContext, useEffect, useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import TranslateIcon from '@mui/icons-material/Translate';
import WindowIcon from '@mui/icons-material/Window';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import AuthorPanel from '@/components/Panels/AuthorPanel/AuthorPanel';
import PostsManagement from '@/components/BlogsManagement/PostsManagement';
import BottomSpeedDial from '@/components/SpeedDial/SpeedDial';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import ManageBlogs from '@/components/ManageBlogs/ManageBlogs';
import { UserDataContext } from '@/context/UserDatasContext';
import { getFullNameById } from '@/lib/actions/users/actions';
import TextEditor from '@/components/TextEditor/TextEditor';
import DoDisturbOffOutlinedIcon from '@mui/icons-material/DoDisturbOffOutlined';
import RejectedPosts from '@/components/RejectedPosts/RejectedPosts';

const Page = () => {
  const {isSelected} = useContext(sideMenuContext);
  const {users,fetchCookies} = useContext(UserDataContext);
    const [name,setName] = useState("")
    useEffect(()=>{
      fetchCookies();
    },[])
    useEffect(()=>{
      const fetchName = async () =>{
        if (users.id) {
          try{
            const response = await getFullNameById(users.id);
            setName(response?.fullName);
          }
          catch{
            setName("")
          }
        }
      }
      fetchName();
    },[users.id])
    const writerName = name;
  const renderSelectedPanel = () => {
    switch (isSelected) {
      case 0:
        return <AuthorPanel />
      case 1:
        return <TextEditor />;
      case 2:
        return <PostsManagement heading={'Blog Posts'}/>
      case 3:
        return <RejectedPosts heading={'Rejcted Posts'}/>
      case 4:
        return <ManageBlogs heading={'All blogs'}/>
      default:
        return null; 
    }
  };
  const actions = [
    { icon: <CreateOutlinedIcon />, name: 'New Post', code:1 },
    { icon: <DoDisturbOffOutlinedIcon />, name: 'Request Translation', code:2 },
    { icon: <ArticleIcon />, name: 'Request Post', code:3 },
  ];
  return (
    <main>
      <SideMenu heading={`Welcome ${writerName} `} 
        menuList={
          [
            { text: "Panel", icon: <WindowIcon /> },
            { text: "Write Blog", icon: <CreateSharpIcon /> },
            { text: "My Blogs", icon: <ArticleIcon /> },
            { text: "Rejections", icon: <DoDisturbOffOutlinedIcon /> },
            { text: "All Blogs", icon: <LibraryBooksSharpIcon /> },
          ]
        }
      >
        {renderSelectedPanel()}
        <BottomSpeedDial actions={actions}/>
      </SideMenu>
    </main>
  )
}

export default Page
