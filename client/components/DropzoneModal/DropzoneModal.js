import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Dropzone from '../DropZone/Dropzone';

export default function DropzoneModal({open,onClose,patient}) {

  return (
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "60%",
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            border:"none",
            borderRadius:"15px",
        }}>
          <Dropzone folder={'prescription'} prefix={'pr_'} parent={2} id={patient}/>
        </Box>
      </Modal>
  );
}
