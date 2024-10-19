import API from "@/app/api/server";

export async function getAllUsers() {
  try {
    const response = await API.get("/users/allUsers");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function changePassword(userId, newPassword) {
  try {
    const response = await API.put(`/users/changePassword/${userId}`, {
      userId,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const response = await API.post(`users/getUserById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getFullNameById(userId) {
  try {
    const response = await API.get(`/users/fullname/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user's full name by ID:", error);
    return null;
  }
}

export async function getUserByUsername(username) {
  try {
    const response = await API.post(`users/getUserByUsername/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function deleteUser(id) {
  try {
    const response = await API.delete(`/users/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await API.put(`/users/update/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export const getDoctorCount = async (userId) => {
  try {
    const response = await API.get(`/users/doctorCount/${userId}`);
    return response.data.doctorCount;
  } catch (error) {
    console.error("Error fetching doctor count:", error);
    throw error;
  }
};

export async function resetPassword(resetIdentifier, resetOption) {
  try {
    const requestData =
      resetOption === "email"
        ? { email: resetIdentifier }
        : { username: resetIdentifier };
    const response = await API.post("/users/forgotPassword", requestData);
    return response.data;
  } catch (error) {
    console.error("Error initiating password reset:", error);
    throw error;
  }
}

export async function completePasswordReset(token, newPassword) {
  try {
    const response = await API.put("/users/resetPassword", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
