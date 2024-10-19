import API from "@/app/api/server";

// Function to add a facility
export const addFacility = async (doctor_id, name, position) => {
    try {
        const response = await API.post("/facility/add", { doctor_id, name, position });
        return response.data;
    } catch (error) {
        console.error('Error adding facility:', error);
        throw error;
    }
};

// Function to update a facility by ID
export const updateFacility = async (id, name, position) => {
    try {
        const response = await API.put(`/facility/update/${id}`, { name, position });
        return response.data;
    } catch (error) {
        console.error('Error updating facility:', error);
        throw error;
    }
};

// Function to delete a facility by ID
export const deleteFacility = async (id) => {
    try {
        const response = await API.delete(`/facility/delete/${id}`);
        if (response.status === 204) {
            return true;
        } else {
            throw new Error('Failed to delete facility');
        }
    } catch (error) {
        console.error('Error deleting facility:', error);
        throw error;
    }
};

// Function to get all facilities
export const getAllFacilities = async () => {
    try {
        const response = await API.get('/facility/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
    }
};

// Function to get a facility by ID
export const getFacilityById = async (id) => {
    try {
        const response = await API.get(`/facility/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facility:', error);
        throw error;
    }
};

// Function to get facilities by doctor ID
export const getFacilitiesByDoctorId = async (doctor_id) => {
    try {
        const response = await API.get(`/facility/getByDoctorId/${doctor_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities by doctor ID:', error);
        throw error;
    }
};