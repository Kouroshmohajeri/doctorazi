import React, { useContext, useState } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Snackbar, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Logout } from '@/lib/auth/userState';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';

function LogoutButton({router}) {
  const [snackOpen, setSnackOpen] = useState(false);
  const {refresh,setRefresh} = useContext(ClinicalRecordContext);


  const handleLogout = async () => {
    await Logout("users/logout");
    localStorage.clear();
    setSnackOpen(true);
    setTimeout(() => router.push('/'), 100);
    setRefresh(!refresh);
  };

  return (
    <>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon sx={{ color: "crimson" }}><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
      <Snackbar open={snackOpen} autoHideDuration={6000} anchorOrigin={{ vertical:"top", horizontal:"right" }} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Logged out successfully
        </Alert>
      </Snackbar>
    </>
  );
}

export default LogoutButton;
