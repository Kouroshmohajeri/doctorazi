import React from 'react';
import { TextField } from '@mui/material';

const MuiSearchBar = ({ onChange }) => {
  return (
    <TextField
      id="search"
      label="Search"
      type="search"
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={onChange}
    />
  );
};

export default MuiSearchBar;
