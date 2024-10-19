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
import Dropzone from '../DropZone/Dropzone';
import { getAllFolders, getFoldersByUserId, deleteFolder, getFoldersByUserIds, getFullNames } from '@/lib/actions/uploadClinicalRecords/actions'; // Import deleteFolder
import FileModal from '../FileModal/FileModal';
import { useContext } from 'react';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';
import { getPatientsByClientId } from '@/lib/actions/doctors/actions';
import MyModal from '../MyModal/MyModal';
import { UserDataContext } from '@/context/UserDatasContext';

export default function ClinicalRecords(folder,prefix) {
  const { refresh, setRefresh } = useContext(ClinicalRecordContext);
  const {users, fetchCookies} = useContext(UserDataContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null); 
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); 
  const [fullNames, setFullNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetchCookies();
  }, []);  

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        let response;
        if (users.id && users.type === 1) {
          response = await getFoldersByUserId(users.id);
          setClinicalRecords(response?.userFolders || response?.foldersByUsers || response?.folders || []); 
        } else if (users.type === 6) {
          response = await getAllFolders();
          setClinicalRecords(response?.userFolders || response?.foldersByUsers || response?.folders || []); 
        }
        else if (users.type === 2) {
          const patients = await getPatientsByClientId(users.id);
          response = await getFoldersByUserIds(patients.patients);
          const userIds = response.foldersByUser.map(user => user.user_id);
          const fullNamesPromises = userIds.map(userId => getFullNames([userId]));
          const fullNamesResults = await Promise.all(fullNamesPromises);
          const fullNames = fullNamesResults.map(result => result[0]); 
          const recordsWithFullNames = [];
          for (let i = 0; i < response.foldersByUser.length; i++) {
            const folder = response.foldersByUser[i];
            const fullName = fullNames[i];
        
            // Check if folders array is not empty
            if (folder.folders.length > 0) {
              recordsWithFullNames.push({
                record: folder.folders[0],
                fullName: fullName
              });
            }
          }
          setClinicalRecords(recordsWithFullNames);
        }
        
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
    fetchRecords();
  }, [users.id, users.type, refresh]);
  

  const handleFolderClick = (folderName) => {
    if (users.type===2) {
      folderName = folderName.record
    }
    setSelectedFolder(folderName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFolder(null);
    setModalOpen(false);
  };

  const handleDeleteFolder = (folderName) => {
    setFolderToDelete(folderName);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteFolder = async () => {
    try {
      await deleteFolder(folderToDelete);
      setModalOpen(false)
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecords = clinicalRecords.filter((record) => {
    if (!record) return false
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    if (users.type===2) {
      const lowercaseRecord = (record.record||'').toLowerCase();
      const lowercaseFullName = (record.fullName||'').toLowerCase();
      return (
        lowercaseRecord.includes(lowercaseSearchQuery) ||
        lowercaseFullName?.includes(lowercaseSearchQuery)
      );
    }
    // else{
    //   return (record.toLowerCase()||'').includes(searchQuery.toLowerCase())
    // }
    else if (typeof record === 'string') { // Check if record is a string
      return record.toLowerCase().includes(lowercaseSearchQuery);
    } else {
      return false;
    }
    
  });

  const noRecordsMessage = filteredRecords.length === 0 ?
    (users.type === 1 ? "You haven't uploaded any records yet." : "No records available.") : null;

  return (
    <Box>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Clinical Records
      </Typography>
      {users.type===1?<Dropzone folder={folder} prefix={prefix} parent={1}/>:null}
      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="Search records..."
          className='form-control w-50 mt-2'
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </Box>
      <List sx={{ flexGrow: 1, maxWidth: '50%' }}>
        {filteredRecords.map((record, index) => (
          <ListItem
            key={index}
            onClick={() => handleFolderClick(record)} 
            secondaryAction={users.type!==2&&
              (<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFolder(record)}> 
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
              primary={users.type===2?`${record.record} ${record.fullName}`:`${record}`} 
            />
          </ListItem>
        ))}
      </List>

      <Typography sx={{ mt: 2 }} variant="subtitle1" component="div">
        {noRecordsMessage}
      </Typography>
      <FileModal open={modalOpen} onClose={handleCloseModal} folderName={selectedFolder} path={'crecord'} userType={users.type} fileType={"crecord"}/>
      <MyModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteFolder}
        title="Confirm Deletion"
        description={`Are you sure you want to delete folder?`}
      />
    </Box>
  );
}