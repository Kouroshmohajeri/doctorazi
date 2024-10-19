// specialityActions.js

// Import the API instance
import API from "@/app/api/server";

// Function to create a new speciality
export const createSpeciality = async (name, translate) => {
    try {
        const response = await API.post("/specialities/add", { name, translate });
        return response.data;
    } catch (error) {
        console.error('Error creating speciality:', error);
        throw error;
    }
};

// Function to get a speciality by ID
export const getSpecialityById = async (id) => {
    try {
        const response = await API.get(`/specialities/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting speciality:', error);
        throw error;
    }
};

// Function to get the translation of a speciality by ID
export const getTranslationById = async (id) => {
    try {
        const response = await API.get(`/specialities/getTranslate/${id}/translate`);
        return response.data;
    } catch (error) {
        console.error('Error getting translation:', error);
        throw error;
    }
};

// Function to get the original form of a speciality by ID
export const getOriginalById = async (id) => {
    try {
        const response = await API.get(`/specialities/getOriginal/${id}/original`);
        return response.data;
    } catch (error) {
        console.error('Error getting original form:', error);
        throw error;
    }
};

// Function to get both original and translated form of a speciality by ID
export const getBothFormsById = async (id) => {
    try {
        const response = await API.get(`/specialities/bothOriginalTranslated/${id}/both`);
        return response.data;
    } catch (error) {
        console.error('Error getting both forms:', error);
        throw error;
    }
};

// Function to list all specialities
export const listSpecialities = async () => {
    try {
        const response = await API.get('/specialities/getAll');
        return response.data;
    } catch (error) {
        console.error('Error listing specialities:', error);
        throw error;
    }
};

// Function to update a speciality by ID
export const updateSpeciality = async (id, name, translate) => {
    try {
        const response = await API.put(`/specialities/update/${id}`, { name, translate });
        return response.data;
    } catch (error) {
        console.error('Error updating speciality:', error);
        throw error;
    }
};

// Function to delete a speciality by ID
export const deleteSpeciality = async (id) => {
    try {
        const response = await API.delete(`/specialities/delete/${id}`);
        if (response.status === 204) {
            return true;
        } else {
            throw new Error('Failed to delete speciality');
        }
    } catch (error) {
        console.error('Error deleting speciality:', error);
        throw error;
    }
};
