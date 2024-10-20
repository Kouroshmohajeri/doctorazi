"use client";
import PostsManagement from "@/components/BlogsManagement/PostsManagement";
import SideMenu from "@/components/SideMenu/SideMenu";
import WriterPanel from "@/components/Panels/WriterPanel/WriterPanel";
import { sideMenuContext } from "@/context/SideMenuContext";
import React, { useContext, useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import WindowIcon from "@mui/icons-material/Window";
import BottomSpeedDial from "@/components/SpeedDial/SpeedDial";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import TextEditor from "@/components/TextEditor/TextEditor";
import { UserDataContext } from "@/context/UserDatasContext";
import { getFullNameById } from "@/lib/actions/users/actions";
import RejectedPosts from "@/components/RejectedPosts/RejectedPosts";
import DoDisturbOffOutlinedIcon from "@mui/icons-material/DoDisturbOffOutlined";

const Page = () => {
  const { isSelected } = useContext(sideMenuContext);
  const { users, fetchCookies } = useContext(UserDataContext);
  const [name, setName] = useState("");

  // Run this effect only once on component mount
  useEffect(() => {
    fetchCookies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep an empty dependency array to ensure it runs only once

  useEffect(() => {
    const fetchName = async () => {
      if (users.id) {
        try {
          const response = await getFullNameById(users.id);
          setName(response?.fullName);
        } catch {
          setName("");
        }
      }
    };
    fetchName();
  }, [users.id]);

  const writerName = name;

  const renderSelectedPanel = () => {
    switch (isSelected) {
      case 0:
        return <WriterPanel />;
      case 1:
        return <TextEditor />;
      case 2:
        return <PostsManagement heading={"Blog Posts"} />;
      case 3:
        return <RejectedPosts heading={"Rejected Posts"} />;
      default:
        return null;
    }
  };

  const actions = [
    { icon: <CreateOutlinedIcon />, name: "New Post", code: 1 },
    { icon: <ArticleIcon />, name: "My Blogs", code: 2 },
  ];

  return (
    <main>
      <SideMenu
        heading={`Welcome ${writerName} `}
        menuList={[
          { text: "Panel", icon: <WindowIcon /> },
          { text: "Write Blog", icon: <CreateSharpIcon /> },
          { text: "My Blogs", icon: <ArticleIcon /> },
          { text: "Rejected blogs", icon: <DoDisturbOffOutlinedIcon /> },
        ]}
      >
        {renderSelectedPanel()}
        <BottomSpeedDial actions={actions} />
      </SideMenu>
    </main>
  );
};

export default Page;
