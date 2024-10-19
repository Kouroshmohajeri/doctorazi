import React from 'react';
import { Button } from '@mui/material';

const ActionButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default ActionButton;
