import API from "@/app/api/server";

// Function to add a biography
export const addBiography = async (doctor_id, short_description, short_description_translated, long_description, long_description_translated, translatedName) => {
    try {
        const response = await API.post("/biography/add", { doctor_id, short_description, short_description_translated, long_description, long_description_translated, translatedName });
        return response.data;
    } catch (error) {
        console.error('Error adding biography:', error);
        throw error;
    }
};

// Function to update a biography by ID
export const updateBiography = async (biography_id, short_description, short_description_translated, long_description, long_description_translated, translatedName) => {
    console.log(biography_id, short_description, short_description_translated, long_description, long_description_translated, translatedName)
    try {
        const response = await API.put(`/biography/update/${biography_id}`, { short_description, short_description_translated, long_description, long_description_translated, translatedName });
        return response.data;
    } catch (error) {
        console.error('Error updating biography:', error);
        throw error;
    }
};


// Function to delete a biography by ID
export const deleteBiography = async (id) => {
    try {
        const response = await API.delete(`/biography/delete/${id}`);
        if (response.status === 204) {
            return true;
        } else {
            throw new Error('Failed to delete biography');
        }
    } catch (error) {
        console.error('Error deleting biography:', error);
        throw error;
    }
};

// Function to get all biographies
export const getAllBiographies = async () => {
    try {
        const response = await API.get('/biography/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching biographies:', error);
        throw error;
    }
};

// Function to get a biography by ID
export const getBiographyById = async (id) => {
    try {
        const response = await API.get(`/biography/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching biography:', error);
        throw error;
    }
};

// Function to get a biography by doctor ID
export const getBiographyByDoctorId = async (doctor_id) => {
    try {
        const response = await API.get(`/biography/getByDoctorId/${doctor_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching biography by doctor ID:', error);
        throw error;
    }
};