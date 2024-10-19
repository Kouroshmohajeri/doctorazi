// lib/actions/translations/actions.js
import API from "@/app/api/server";

// Get all translations
export const getAllTranslations = async () => {
    try {
        const response = await API.get("/translations/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching translations:", error);
        return [];
    }
};

// Get translation by ID
export const getTranslationById = async (id) => {
    try {
        const response = await API.get(`/translations/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching translation with ID ${id}:`, error);
        return null;
    }
};

// Create a new translation
export const createTranslation = async (translationData) => {
    try {
        const response = await API.post("/translations/add", translationData);
        return response.data;
    } catch (error) {
        console.error("Error creating translation:", error);
        return null;
    }
};

// Update a translation
export const updateTranslation = async (id, translationData) => {
    try {
        const response = await API.put(`/translations/update/${id}`, translationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating translation with ID ${id}:`, error);
        return null;
    }
};

// Delete a translation
export const deleteTranslation = async (id) => {
    try {
        const response = await API.delete(`/translations/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting translation with ID ${id}:`, error);
        return null;
    }
};
