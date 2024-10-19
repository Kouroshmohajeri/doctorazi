import React, { useState } from 'react';
import { Box, Modal, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius:"15px",
  boxShadow: 24,
  p: 4,
};

const MyModal = ({ open, onClose, onConfirm, title, description, roles = [], currentUserRole }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const isConfirmDisabled = roles.length > 0 && (!selectedRole || selectedRole === currentUserRole);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">{title}</Typography>
        <Typography sx={{ mt: 2 }}>{description}</Typography>
        {roles.length > 0 && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Role"
            >
              {roles
                .filter(role => role.role_id !== currentUserRole)
                .map(role => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => roles.length > 0 ? onConfirm(selectedRole) : onConfirm()} disabled={isConfirmDisabled}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MyModal;
