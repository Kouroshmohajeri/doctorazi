import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { getPrescriptionFoldersByUserId, getAllPrescriptionFolders, deletePrescriptionFolder } from '@/lib/actions/prescriptions/actions.js';
import { useContext } from 'react';
import { getPatientsByClientId } from '@/lib/actions/doctors/actions';
import { UserDataContext } from '@/context/UserDatasContext';
import FileModal from '../FileModal/FileModal.js';
import MyModal from '../MyModal/MyModal.js';
import { getFullNameById } from '@/lib/actions/users/actions.js';

export default function Prescriptions() {
  const [refresh, setRefresh] = useState(false);
  const { users, fetchCookies } = useContext(UserDataContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner

  useEffect(() => {
    fetchCookies();
  }, []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        let response;
        if (users.id && users.type === 1) {
          response = await getPrescriptionFoldersByUserId(users.id);
          setPrescriptions(response?.userFolders || response?.foldersByUsers || response?.folders || []);
        } else if (users.type === 6) {
          response = await getAllPrescriptionFolders();
          setPrescriptions(response?.userFolders || response?.foldersByUsers || response?.folders || []);
        } else if (users.type === 2) {
          const patients = await getPatientsByClientId(users.id);
          const prescriptionsPromises = patients.patients.map(async (member) => {
            const response = await getPrescriptionFoldersByUserId(member);
            const fullName = await getFullNameById(member);
            const folderName = response.userFolders[0] || '';
            return { folderName, id: member, fullName };
          });

          try {
            const prescriptionsResults = await Promise.all(prescriptionsPromises);
            setPrescriptions(prescriptionsResults.filter(prescription => prescription.folderName !== '')); // Filter out prescriptions with empty folderName
          } catch (error) {
            console.error('Error fetching prescriptions:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchPrescriptions();
  }, [users.id, users.type, refresh]);

  const handlePrescriptionClick = (prescriptionName) => {
    if (users.type === 2) {
      prescriptionName = prescriptionName.id;
    }
    setSelectedPrescription(prescriptionName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
    setModalOpen(false);
  };

  const handleDeletePrescription = (prescriptionName) => {
    setPrescriptionToDelete(prescriptionName.folderName);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeletePrescription = async () => {
    try {
      await deletePrescriptionFolder(prescriptionToDelete);
      setModalOpen(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting prescription:', error);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter prescriptions based on search query
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const fullName = prescription.fullName?.fullName || '';
    const folderName = prescription.folderName || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) || folderName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Prescriptions
      </Typography>
      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="Search prescriptions..."
          className='form-control w-50 mt-2'
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </Box>
      {loading ? ( // Show loading spinner while loading
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, maxWidth: '50%' }}>
          {filteredPrescriptions.length === 0 ? ( // If prescriptions are empty
            <Typography variant="body1" color="textSecondary" align="center">
              {users.type === 1 ? "No prescriptions have been issued for you yet." : "You haven't issued any prescriptions yet."}
            </Typography>
          ) : (
            filteredPrescriptions.map((prescription, index) => (
              <ListItem
                key={index}
                onClick={() => handlePrescriptionClick(prescription)}
                secondaryAction={users.type !== 1 &&
                  (<IconButton edge="end" aria-label="delete" onClick={() => handleDeletePrescription(prescription)}>
                    <DeleteIcon />
                  </IconButton>)
                }
                sx={{ cursor: 'pointer' }}
              >
                <ListItemAvatar> 
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={users.type === 2 ? `${prescription.fullName?.fullName || ''} ${prescription.folderName || ''}` : `${prescription.folderName || ''}`}
                />
              </ListItem>
            ))
          )}
        </List>
      )}
      <FileModal open={modalOpen} onClose={handleCloseModal} folderName={users.type===2?`pr_${selectedPrescription}`:`pr_${users.id}`} path={'prescription'} userType={users.type} fileType={"precord"}/>
      <MyModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeletePrescription}
        title="Confirm Deletion"
        description={`Are you sure you want to delete prescription?`}
      />
    </Box>
  );
}