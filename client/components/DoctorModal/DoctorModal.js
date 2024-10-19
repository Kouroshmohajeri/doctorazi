import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { getAllDoctors, getPatientsByClientId, updateDoctor } from '@/lib/actions/doctors/actions';
import { getFullNameById, updateUser, getUserById } from '@/lib/actions/users/actions'; // Import the getUserById function
import MyModal from '../MyModal/MyModal';

const DoctorModal = ({ open, onClose, selectedPatient, doctorId }) => {
  const [doctors, setDoctors] = useState([]);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(''); // Initialize with an empty string

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await getAllDoctors();
        const doctorsWithFullName = await Promise.all(
          doctorsData.map(async (doctor) => {
            const doctorFullData = await getFullNameById(doctor.client_id);
            return { id: doctor.client_id, fullName: doctorFullData.fullName, doctorId: doctor.doctor_id };
          })
        );
        setDoctors(doctorsWithFullName);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (open) {
      fetchDoctors();
    }
  }, [open]);

  const handleConfirmPermission = async () => {
    setPermissionModalOpen(false);
    if (!selectedDoctor || !selectedPatient) return;
    try {
      await referHandler(selectedDoctor);
      await updateUserDoctorList(selectedPatient.id, selectedDoctor.doctorId); // Use doctorId instead of id
    } catch (error) {
      console.error("Error confirming permission:", error);
    }
  };

  const referHandler = async (doctor) => {
    try {
      const patientsData = await getPatientsByClientId(doctor.id);
      const patientsList = patientsData.patients;
      const patients = Array.isArray(patientsList) ? patientsList : [];
      
      if (patients.includes(selectedPatient.id)) {
        alert("Selected patient already exists in the doctor's list.");
        return;
      }

      const updatedPatients = [...patients, selectedPatient.id];
      const updatedPatientsString = updatedPatients.join(',');
      await updateDoctor(doctor.doctorId, { patients: updatedPatientsString });
      
      alert("Patient added successfully to the doctor's list.");
    } catch (error) {
      console.error("Error adding patient to the doctor's list:", error);
    }
  };

  const updateUserDoctorList = async (userId, doctorId) => {
    try {
      // Fetch current user data
      const user = await getUserById(userId);

      // Get the current list of doctors and add the new doctorId
      const currentDoctors = user.doctors ? user.doctors.split(',').filter(Boolean) : [];
      if (currentDoctors.includes(doctorId.toString())) {
        alert("Selected doctor already exists in the user's doctor list.");
        return;
      }
      const updatedDoctors = [...currentDoctors, doctorId].join(',');

      // Update the user's doctor list
      await updateUser(userId, { doctors: updatedDoctors });
    } catch (error) {
      console.error("Error updating user's doctor list:", error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: 'none', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Select Doctor</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Doctor</InputLabel>
            <Select
              label="Doctor"
              value={selectedDoctor}
              onChange={(e) => {
                const doctorId = e.target.value;
                setSelectedDoctor(doctors.find(doctor => doctor.doctorId === doctorId));
                setPermissionModalOpen(true);
              }}
            >
              {doctors.map((doctor) => (
                doctorId !== doctor.doctorId && <MenuItem key={doctor.doctorId} value={doctor.doctorId}>{`${doctor.fullName}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose}>Close</Button>
          </Box>
        </Box>
      </Modal>
      <MyModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        onConfirm={handleConfirmPermission}
        title="Confirm Permission"
        description="By confirming, the medical records of the patient will be visible to the selected doctor."
        roles={[]}
        currentUserRole=""
      />
    </>
  );
};

export default DoctorModal;
