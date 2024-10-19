import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import styles from './SpeedDia.module.css';
import { useContext } from 'react';
import { sideMenuContext } from '@/context/SideMenuContext';
import { useRouter } from 'next/navigation';

export default function BottomSpeedDial({actions}) {
  const {setIsSelected} = useContext(sideMenuContext);
  const router = useRouter()
  const handleClick = (action) =>{
    setIsSelected(action.code)
    if (action.name==='New Appointment') {
      setIsSelected(0)
      router.push("/appointment")
    }
    else{
      setIsSelected(action.code)
    }
  }
  return (
    <div className={styles.speedDialmy}>
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
            ariaLabel="My Doctor Speed Dial"
            sx={{ position: 'absolute', bottom: 16, right: 16}}
            icon={<SpeedDialIcon />}
            
        >
            {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={()=>{handleClick(action)}}
            />
            ))}
        </SpeedDial>
        </Box>
    </div>
  );
}
