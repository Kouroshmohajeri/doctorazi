import API from "@/app/api/server";

// Function to get all folders
export const getAllProfileImagesFolders = async () => {
    try {
        const response = await API.get("/profileImage/folders");
        return response.data;
    } catch (error) {
        console.error("Error fetching folders:", error);
        throw error;
    }
};

// Function to get records by file name
export const getProfileImageByFileName = async (fileName) => {
    try {
        const response = await API.get(`/profileImage/records/${fileName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

// Function to get records by folder name
export const getProfileImageByFolderName = async (folderName) => {
    try {
        const response = await API.get(`/profileImage/folder/${folderName}/files`);
        return response.data;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

// Function to get folders by user ID
export const getProfileImagesByUserId = async (userId) => {
    try {
        const response = await API.get(`/profileImage/folders/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching folders by user ID:", error);
        throw error;
    }
};

// Function to delete folder by name
export const deleteProfileImagesByName = async (folderName) => {
    try {
        const response = await API.delete(`/profileImage/folders/${folderName}`);
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to delete folder');
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
        throw error;
    }
};

// Function to delete file by folder name and file name
export const deleteProfileImagesByFolderAndFileName = async (folderName, fileName) => {
    try {
        const response = await API.delete(`/profileImage/files/${folderName}/${fileName}`);
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to delete file');
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

// // Function to delete all files in a folder
// export const deleteAllProfileImagesInFolder = async (folderName) => {
//     try {
//         const response = await API.delete(`/profileImage/folder/${folderName}/files`);
//         if (response.status === 200) {
//             return true;
//         } else {
//             throw new Error('Failed to delete all files in folder');
//         }
//     } catch (error) {
//         console.error("Error deleting all files in folder:", error);
//         throw error;
//     }
// };
