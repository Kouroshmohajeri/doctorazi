import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { DeleteForeverOutlined, UpgradeOutlined } from '@mui/icons-material';

const HireTable = ({ users, onPromote, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Date of Join</TableCell>
            <TableCell>Last Update</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.roleName}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button onClick={() => onPromote(user)}><UpgradeOutlined /></Button>
                <Button onClick={() => onDelete(user)}><DeleteForeverOutlined /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HireTable;