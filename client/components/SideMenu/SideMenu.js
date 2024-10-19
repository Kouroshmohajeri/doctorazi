"use client";
import React, { useState, useEffect, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { dimensionContext } from "@/context/DimensionContext";
import { sideMenuContext } from "@/context/SideMenuContext";
import LogoutButton from "../LogoutButton/LogoutButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SideMenu.module.css";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import SettingsModal from "../SettingsModal/SettingsModal";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
    position: "relative",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function SideMenu({ children, heading, menuList }) {
  const theme = useTheme();
  const router = useRouter();
  const { isSelected, setIsSelected } = useContext(sideMenuContext);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { checkWindowSize, isDesktop } = useContext(dimensionContext);

  useEffect(() => {
    const handleResize = () => {
      checkWindowSize();
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it to set the initial state based on current window size

    return () => window.removeEventListener("resize", handleResize);
  }, [checkWindowSize]);

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const onClickMenu = (number) => {
    setIsSelected(number);
    setOpen(false);
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const menuItems = menuList.map((item, index) => (
    <ListItemButton key={index} onClick={() => onClickMenu(index)}>
      <ListItemIcon sx={{ color: isSelected === index ? "#5ABCF7" : "" }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.text}
        sx={{ color: isSelected === index ? "#5ABCF7" : "" }}
      />
    </ListItemButton>
  ));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "rgb(91, 188, 247)",
          width: "fit-content",
          minWidth: "100%",
          maxWidth: "100%",
          margin: "auto",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            {heading}|{" "}
            <Link href={"/"} className={styles.links}>
              <HomeSharpIcon />
            </Link>
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open} sx={{ margin: "auto", width: "fit-content" }}>
        <DrawerHeader />
        <div className={styles.children}>{children}</div>
      </Main>
      <Drawer
        sx={{
          width: "fit-content",
          flexShrink: 0,
          // "& .MuiDrawer-paper": { width: drawerWidth },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{menuItems}</List>
        <Divider />
        <List>
          <ListItemButton onClick={handleSettingsOpen}>
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
          <LogoutButton router={router} />
        </List>
      </Drawer>
      <SettingsModal open={settingsOpen} onClose={handleSettingsClose} />
    </Box>
  );
}
