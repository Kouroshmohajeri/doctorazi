import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton, TextField, InputAdornment, Tooltip, MenuItem, FormControl, InputLabel, Select, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import NoteAddSharpIcon from '@mui/icons-material/NoteAddSharp';
import { UserDataContext } from '@/context/UserDatasContext';
import { getPatientsByClientId, removePatientFromClient } from '@/lib/actions/doctors/actions';
import { getFullNameById } from '@/lib/actions/users/actions';
import MyModal from '../MyModal/MyModal';
import DoctorModal from '../DoctorModal/DoctorModal';
import DropzoneModal from '../DropzoneModal/DropzoneModal';

const Patients = () => {
  const { users, fetchCookies } = useContext(UserDataContext);
  const [refresh, setRefresh] = useState(false);
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [drpOpen,setDrpOpen] = useState(false);
  const [fullNames, setFullNames] = useState([]);
  const [openModal,setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [selectedDoctor, setSelectedDoctor] = useState(''); 
  const [doctorModalOpen, setDoctorModalOpen] = useState(false); 

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let response;
        if (users.id) {
          response = await getPatientsByClientId(users.id);
          setPatients(response.patients);
          // Fetch full names for each patient
          const patientDetails = await Promise.all(response.patients.map(async (patient) => {
            const fullName = await getFullNameById(patient);
            return { fullName, id: patient };
          }));
          setFullNames(patientDetails);
        }
      } catch (error) {
        console.log("Error while fetching patients", error);
        setPatients([]);
        setFullNames([]);
      }
    };
    fetchPatients();
  }, [users.id, fetchCookies, refresh]);

  const handleDelete = async () => {
    setOpenModal(true);
    try {
      if (selectedPatient) {
        await removePatientFromClient(users.id, selectedPatient.id); 
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModal = (patientId) => {
    setOpenModal(true);
    setSelectedPatient(patientId);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPatient(null);
    setSelectedDoctor('');
  };

  const handleRefer = (patientId) => {
    setSelectedPatient(patientId);
    setDoctorModalOpen(true);
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId);
    setDoctorModalOpen(false); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const openDropzone = (patientId) =>{
    setSelectedPatient(patientId);
    setDrpOpen(true);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = fullNames.filter(patient =>
    patient.fullName.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Patients"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.fullName.fullName}</TableCell>
                  <TableCell>
                    <a href={`tel:${patient.fullName.phone_number}`}>{patient.fullName.phone_number}</a>
                  </TableCell>
                  <TableCell><a href={`mailto:${patient.fullName.email}`}>{patient.fullName.email}</a></TableCell>
                  <TableCell>
                    <Tooltip title="Refer">
                      <IconButton sx={{color:"#5ABCF7"}} onClick={() => handleRefer(patient)}>
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Prescription">
                      <IconButton sx={{color:"coral"}} onClick={()=>{openDropzone(patient)}}>
                        <NoteAddSharpIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleOpenModal(patient)} sx={{color:"crimson"}}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <MyModal
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Delete Patient"
        description={`Are you sure you want to delete ${selectedPatient ? selectedPatient.fullName.fullName : ''}?`}
      />
      <DoctorModal
        doctorId={users.id}
        open={doctorModalOpen}
        selectedPatient={selectedPatient}
        onClose={() => setDoctorModalOpen(false)}
        onSelectDoctor={handleDoctorSelect}
      />
      <DropzoneModal
        open={drpOpen}
        onClose={()=>{setDrpOpen(false)}}
        patient={selectedPatient ? selectedPatient.id : ''}
      />
    </Box>
  );
}

export default Patients;