import API from "@/app/api/server";

export const addClinicalRecord = async (clinicalRecordData) => {
  try {
    const response = await API.post("/clinicalRecords/uploadingClinicalRecords", clinicalRecordData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding clinical record:", error);
    return { success: false, message: error.message };
  }
};

export const updateClinicalRecord = async (recordId, updatedData) => {
  try {
    const response = await API.put(`/clinicalRecords/update/${recordId}`, updatedData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating clinical record:", error);
    return { success: false, message: error.message };
  }
};

export const deleteClinicalRecord = async (recordId) => {
  try {
    await API.delete(`/clinicalRecords/delete/${recordId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting clinical record:", error);
    return { success: false, message: error.message };
  }
};

export const getAllClinicalRecords = async () => {
  try {
    const response = await API.get("/clinicalRecords/allClinicalRecords");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching all clinical records:", error);
    return { success: false, message: error.message, data: [] };
  }
};

export const getClinicalRecordById = async (recordId) => {
  try {
    const response = await API.get(`/clinicalRecords/getClinicalRecord/${recordId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching clinical record by ID:", error);
    return { success: false, message: error.message };
  }
};