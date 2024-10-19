import API from "@/app/api/server";

// Get all translators
export const getAllTranslators = async () => {
    try {
        const response = await API.get("/translators/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching translators:", error);
        return [];
    }
};

// Get translator by ID
export const getTranslatorById = async (id) => {
    try {
        const response = await API.get(`/translators/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching translator with ID ${id}:`, error);
        return null;
    }
};
// Get translator by User ID
export const getTranslatorByUserId = async (userId) => {
    try {
        const response = await API.get(`/translators/getByUserId/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching translator with user ID ${userId}:`, error);
        return null;
    }
};

// Create a new translator
export const createTranslator = async (translatorData) => {
    try {
        const response = await API.post("/translators/add", translatorData);
        return response.data;
    } catch (error) {
        console.error("Error creating translator:", error);
        return null;
    }
};

// Update a translator
export const updateTranslator = async (id, translatorData) => {
    try {
        const response = await API.put(`/translators/update/${id}`, translatorData);
        return response.data;
    } catch (error) {
        console.error(`Error updating translator with ID ${id}:`, error);
        return null;
    }
};

// Delete a translator
export const deleteTranslator = async (id) => {
    try {
        const response = await API.delete(`/translators/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting translator with ID ${id}:`, error);
        return null;
    }
};
