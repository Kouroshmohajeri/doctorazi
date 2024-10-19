'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton, Tooltip, Snackbar, Alert, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import MyModal from '../MyModal/MyModal.js';
import { getAllAppointments, updateAppointment, deleteAppointment, getAppointmentsByClientId, getAppointmentsByPhysicianId } from '@/lib/actions/appointments/actions.js';
import DeleteIcon from '@mui/icons-material/Delete';
import decoder from '@/lib/decode.js';
import getHttpOnlyCookies from '@/getCookies.js';
import { getDoctorByClientId } from '@/lib/actions/doctors/actions.js';
import { UserDataContext } from '@/context/UserDatasContext.js';

const columns = [
  { id: 'appointment_id', label: 'ID', minWidth: 100 },
  { id: 'physician', label: 'Physician', minWidth: 170 },
  { id: 'client', label: 'Client', minWidth: 170 },
  { id: 'appointment_date', label: 'Date', minWidth: 100 },
  { id: 'appointment_time', label: 'Time', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

const statusMapping = {
  1: 'Unconfirmed',
  2: 'Confirmed',
  3: 'Cancelled',
};
const modalMapping = {
  1: 'unconfirm',
  2: 'Confirm',
  3: 'Cancel',
};

export default function UserTable() {
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionToConfirm, setActionToConfirm] = useState({});
  const {users,fetchCookies} = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    fetchCookies();
  },[])
  useEffect(() => {
    if (users.type) {
      fetchAppointments();
    }
  }, [users]);

  const fetchAppointments = async () => {
    let fetchedAppointments = [];
    let doctorId;
    try {
      if (users.type === 6) {
        fetchedAppointments = await getAllAppointments();
      } else if (users.type === 1) {
        fetchedAppointments = await getAppointmentsByClientId(users.id);
      } else if (users.type === 2) {
        doctorId = await getDoctorByClientId(users.id);
        fetchedAppointments = await getAppointmentsByPhysicianId(doctorId.doctorId);
      }
      setAppointments(fetchedAppointments);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      setLoading(false)
    }
  };

  const handleActionClick = async (actionCode, appointment) => {
    const actionName = modalMapping[actionCode];
    setActionToConfirm({ code: actionCode, name: actionName });
    setCurrentAppointment(appointment);
    setModalOpen(true);
  };
  
  const handleDelete = async (appointmentId) => {
    const confirmation = window.confirm('Are you sure you want to delete this appointment?');
    if (confirmation) {
      const response = await deleteAppointment(appointmentId);
      if (response.success) {
        fetchAppointments(); // Refresh data
        setSnackbar({ open: true, message: 'Appointment deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete the appointment', severity: 'error' });
      }
    }
  };
  
  const onConfirmModal = async () => {
    const updatedData = { status: actionToConfirm.code };
    const response = await updateAppointment(currentAppointment.appointment_id, updatedData);
    if (response.success) {
      fetchAppointments(); 
      const actionName = actionToConfirm?.name || '';
      setSnackbar({ open: true, message: `Appointment ${actionName.toLowerCase()} successfully`, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Failed to update the appointment', severity: 'error' });
    }
    setModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? ( // Render spinner if loading
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                {users.type !== 2 && <TableCell align="center" style={{ minWidth: 170 }}>Join</TableCell>}
                {users.type !== 1 && <TableCell align="center" style={{ minWidth: 170 }}>Host</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={appointment.appointment_id}>
                  {columns.map((column) => {
                    let value = appointment[column.id];
                    if (column.id === 'appointment_id') {
                      // Prefix "AP" to the actual appointment ID
                      value = `AP${appointment[column.id]}`;
                    }
                    if (column.id === 'client') {
                      value = appointment.Client?.name || `${appointment.Client?.first_name} ${appointment.Client?.last_name}` || 'N/A';
                    }
                    if (column.id === 'physician') {
                      value = `${appointment.Physician?.ClientDetails?.first_name} ${appointment.Physician?.ClientDetails?.last_name}` || 'N/A';
                    }
                    
                    if (column.id === 'delete') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(appointment.appointment_id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      );
                    }
                    
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {users.type!==1?
                            <Tooltip title="Confirm">
                              <span>
                                <IconButton onClick={() => handleActionClick(2, appointment)} disabled={appointment.status === "Confirmed"}>
                                  <CheckCircleIcon color={appointment.status === "Confirmed" ? 'disabled' : 'success'} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          :null}
                          {users.type!==1?
                            <Tooltip title="Mark as Pending">
                              <span>
                                <IconButton onClick={() => handleActionClick(1, appointment)} disabled={appointment.status === "Pending"}>
                                  <HourglassEmptyIcon color={appointment.status === "Pending" ? 'disabled' : 'warning'} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          :null}
                          <Tooltip title="Cancel">
                            <span>
                              <IconButton onClick={() => handleActionClick(3, appointment)} disabled={appointment.status === "Cancelled"}>
                                <CancelIcon color={appointment.status === "Cancelled" ? 'disabled' : 'error'} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  {users.type !== 2 && appointment.link && (
                    <TableCell align="center">
                      <Tooltip title="Join Meeting">
                        <a href={appointment.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button variant="contained" color="primary">Join Now</Button>
                        </a>
                      </Tooltip>
                    </TableCell>
                  )}
                  {users.type !== 1 && appointment.host_link && (
                    <TableCell align="center">
                      <Tooltip title="Host Meeting">
                        <a href={appointment.host_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button variant="contained" color="secondary">Join Now</Button>
                        </a>
                      </Tooltip>
                    </TableCell>
                  )}
                  {users.type!==1?
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(appointment.appointment_id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>:null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      )}
      <MyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={onConfirmModal}
        title={`Confirm ${actionToConfirm?.name || ''} Appointment`} // Use optional chaining to prevent errors
        description={`Are you sure you want to ${actionToConfirm?.name?.toLowerCase() || ''} this appointment?`}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
