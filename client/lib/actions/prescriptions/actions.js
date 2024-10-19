import API from "@/app/api/server";

export async function getAllPrescriptionFolders() {
    try {
      const response = await API.get(`prescriptions/allFolders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all folders with prescriptions:', error);
      throw error;
    }
  }
  
  export async function getPrescriptionFile(folderName) {
    try {
      const response = await API.get(`/prescriptions/files/${folderName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prescription file ${folderName}:`, error);
      throw error;
    }
  }
  
  export async function getPrescriptionFoldersByUserId(userId) {
    try {
      const response = await API.get(`/prescriptions/folders/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching folders for user ${userId}:`, error);
      throw error;
    }
  }
  
  export const deletePrescriptionFileInFolder = async (folderName, fileName) => {
    try {
      const response = await API.delete(`/prescriptions/deleteFile/${folderName}/${fileName}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  export async function deletePrescriptionFolder(folderName) {
    try {
      const response = await API.delete(`prescriptions/deleteFolder/${folderName}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting folder ${folderName}:`, error);
      throw error;
    }
  }
  