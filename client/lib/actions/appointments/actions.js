import API from "@/app/api/server";

export const getAllAppointments = async () => {
    try {
      const response = await API.get("/appointments/getAll");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await API.put(`appointments/update/${appointmentId}`, appointmentData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false };
  }
};

export const getAppointmentsByClientId = async (clientId) => {
  try {
    const response = await API.get(`/appointments/getByClient/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments for client:", error);
    return [];
  }
};

export const getAppointmentsByPhysicianId = async (physicianId) => {
  try {
    const response = await API.post(`/appointments/getByPhysician/${physicianId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments for physician:", error);
    return [];
  }
};


export const deleteAppointment = async (appointmentId) => {
  try {
    await API.delete(`/appointments/delete/${appointmentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.response?.data?.error || "Failed to delete appointment." };
  }
};

export const createAppointment = async (appointmentDetails) => {
  try {
    const response = await API.post("/appointments/new", appointmentDetails);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: error.response?.data?.error || "Failed to create appointment." };
  }
};

