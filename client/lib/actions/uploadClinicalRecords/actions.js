import API from '@/app/api/server';

// const uploadFiles = async (userId, formData) => {
//   try {
//     const response = await API.post(`/upload/clinicalRecord/${userId}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     // You can perform additional actions here if needed
//     return response.data; // Return the response if needed
//   } catch (error) {
//     // Handle upload error
//     console.error('Error uploading files:', error);
//     throw error; // Throw the error to handle it in the calling function
//   }
// };

const uploadFiles = async (userId, folder, prefix, formData) => {
  try {
    const response = await API.post(`/upload/files/${userId}/${folder}/${prefix}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // You can perform additional actions here if needed
    return response.data; // Return the response if needed
  } catch (error) {
    // Handle upload error
    console.error('Error uploading files:', error);
    throw error; // Throw the error to handle it in the calling function
  }
};


const getFilesInFolder = async (folderName) => {
  try {
    const response = await API.get(`/records/files/${folderName}`); // Endpoint to get files in a folder
    return response.data;
  } catch (error) {
    console.error('Error getting files in folder:', error);
    throw error;
  }
};

const getRecordsImage = async (folderName) => {
  try {
    const response = await API.get(`/records/recordImage/${folderName}`); // Endpoint to get images in a folder
    return response.data;
  } catch (error) {
    console.error('Error getting files in folder:', error);
    throw error;
  }
};

const getAllFolders = async () => {
  try {
    const response = await API.get('/records/folders');
    return response.data;
  } catch (error) {
    console.error('Error getting all folders:', error);
    throw error;
  }
};

const getFoldersByUserId = async (userId) => {
  try {
    const response = await API.get(`/records/folders/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting folders by user ID:', error);
    throw error;
  }
};

const deleteFolder = async (folderName) => {
  try {
    const response = await API.delete(`/records/folders/${folderName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

const deleteFileInFolder = async (folderName, fileName) => {
  try {
    const response = await API.delete(`/records/files/${folderName}/${fileName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
const getFoldersByUserIds = async (user_ids) => {
  try {
    const response = await API.post('/records/folders', { user_ids });
    return response.data;
  } catch (error) {
    console.error('Error getting folders by user IDs:', error);
    throw error;
  }
};
async function getFullNames(userIds) {
  try {
    const response = await API.post(`/users/getFoldersByUserIds`, { userIds });
    const fullNames = response.data.foldersByUser.map(user => user.full_name);
    return fullNames;
  } catch (error) {
    console.error("Error fetching full names by user IDs:", error);
    throw error; 
  }
}

export { uploadFiles, getFullNames, getFoldersByUserIds, getAllFolders, getFoldersByUserId, deleteFolder, getFilesInFolder, getRecordsImage, deleteFileInFolder };