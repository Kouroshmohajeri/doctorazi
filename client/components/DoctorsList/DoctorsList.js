import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Paper, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getFullNameById, getUserById, updateUser } from '@/lib/actions/users/actions';
import { getSpecialityById } from '@/lib/actions/speciality/actions';
import { getDoctor, updateDoctor } from '@/lib/actions/doctors/actions';

const DoctorsList = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    const fetchUserAndDoctors = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);

        if (userData.doctors) {
          const doctorIds = userData.doctors.split(',').filter(Boolean);
          const doctorsData = await Promise.all(
            doctorIds.map(async (doctorId) => {
              const doctor = await getDoctor(doctorId);
              const doctorFullData = await getFullNameById(doctor.client_id);
              const specialityData = await getSpecialityById(doctor.speciality_id);

              return { 
                id: doctor.client_id, 
                fullName: doctorFullData.fullName, 
                speciality: `${specialityData.name} - ${specialityData.translate}`,
                doctorId: doctor.doctor_id 
              };
            })
          );
          setDoctors(doctorsData);
        }
      } catch (error) {
        console.error("Error fetching user or doctors:", error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error fetching user or doctors');
        setSnackbarOpen(true);
      }
    };

    fetchUserAndDoctors();
  }, [userId]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteDoctor = async () => {
    setDialogOpen(false);
    try {
      // Remove the doctor from the user's doctors list
      const updatedDoctors = user.doctors.split(',').filter(id => id !== selectedDoctorId.toString()).join(',');
      await updateUser(userId, { doctors: updatedDoctors });

      // Remove the user from the doctor's patients list
      const doctor = await getDoctor(selectedDoctorId);
      const updatedPatients = doctor.patients.split(',').filter(id => id !== userId.toString()).join(',');
      await updateDoctor(doctor.doctor_id, { patients: updatedPatients });

      // Update the state
      setDoctors(doctors.filter(doctor => doctor.doctorId !== selectedDoctorId));
      setSnackbarSeverity('success');
      setSnackbarMessage('Doctor removed successfully');
    } catch (error) {
      console.error("Error deleting doctor from user's list or removing user from doctor's patient list:", error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting doctor');
    } finally {
      setSnackbarOpen(true);
      setSelectedDoctorId(null);
    }
  };

  const handleOpenDialog = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDoctorId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredDoctors = doctors.filter(doctor => doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <TextField
        label="Search Doctors"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Speciality</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.doctorId}>
                <TableCell>{doctor.fullName}</TableCell>
                <TableCell>{doctor.speciality}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(doctor.doctorId)}>
                    <DeleteIcon sx={{ color: "crimson" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you remove the doctor, the doctor will no longer be able to see your clinical records. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteDoctor} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DoctorsList;
