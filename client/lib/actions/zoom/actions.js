import API from "@/app/api/server";

export async function getAllMeetings() {
    try {
        const response = await API.get("/zoom/meetings");
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; 
    }
}
export async function createMeeting(values) {
    try {
        const response = await API.post("/zoom/createMeeting",values);
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; 
    }
}