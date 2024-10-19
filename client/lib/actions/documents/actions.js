import API from "@/app/api/server";

export const createDocument = async (documentData) => {
    try {
        const response = await API.post("/documents/create", documentData);
        return response.data;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
}

export const getDocumentById = async (documentId) => {
    try {
        const response = await API.get(`/documents/${documentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        throw error;
    }
}

export const getDocumentsByUserId = async (userId) => {
    try {
        const response = await API.get(`/documents/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching documents by user ID:", error);
        throw error;
    }
}

export const updateDocument = async (documentId, updates) => {
    try {
        const response = await API.put(`/documents/update/${documentId}`, updates);
        return response.data;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export const deleteDocument = async (documentId) => {
    try {
        await API.delete(`/documents/delete/${documentId}`);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}
