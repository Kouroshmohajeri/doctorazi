import API from "@/app/api/server";

export const getAllRoles = async ()=>{
    try {
        const response = await API.get("/roles/allRoles");
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; 
    }
}
