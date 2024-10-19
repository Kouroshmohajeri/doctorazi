import API from "@/app/api/server";

export const addNewDoctor = async (doctorData) => {
    try {
        const response = await API.post("/doctors/new", doctorData);
        return response.data;
    } catch (error) {
        console.error("Error adding new doctor:", error.response?.data || error);
        throw error;
    }
};

export const getDoctor = async (doctorId) => {
    try {
        const response = await API.get(`/doctors/doctors/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor:", error.response?.data || error);
        throw error;
    }
};

export const getDoctorByClientId = async (clientId) =>{
    try {
        const response = await API.post(`/doctors/doctorByClientId/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor:", error.response?.data || error);
        throw error;
    }
}

export const getDoctorBySpecialityId = async (specialityId) =>{
    try {
        const response = await API.get(`/doctors/doctorBySpecialityId/${specialityId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor:", error.response?.data || error);
        throw error;
    }
}

export const getPatientsByClientId = async (clientId) => {
    try {
        const response = await API.get(`/doctors/patients/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching patients by client ID:", error.response?.data || error);
        throw error;
    }
};

export const getAllDoctors = async () => {
    try {
        const response = await API.get("/doctors/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching all doctors:", error.response?.data || error);
        throw error;
    }
};

export const deleteDoctor = async (doctorId) => {
    try {
        const response = await API.delete(`/doctors/${doctorId}`);
        return response.data; // Or simply return true/false based on your API design
    } catch (error) {
        console.error("Error deleting doctor:", error.response?.data || error);
        throw error;
    }
};

export const removePatientFromClient = async (clientId, userId) => {
    try {
        const response = await API.delete(`/doctors/patients/${clientId}`, { data: { userId } });
        return response.data;
    } catch (error) {
        console.error("Error removing patient from client:", error.response?.data || error);
        throw error;
    }
};

export const updateDoctor = async (doctorId, modifiedData) => {
    try {
        const response = await API.put(`/doctors/update/${doctorId}`, modifiedData); // Using PATCH for partial update
        return response.data;
    } catch (error) {
        console.error("Error updating doctor:", error.response?.data || error);
        throw error;
    }
};
