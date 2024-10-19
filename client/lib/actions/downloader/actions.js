import API from "@/app/api/server";

export const downloadFile = async (folder, file) => {
    try {
        const response = await API({
            method: 'GET',
            url: `/download/${folder}/${file}`,
            responseType: 'blob', // Important: responseType should be set to 'blob' for downloading files
        });

        // Create a temporary anchor element
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file);

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Optional: You can handle success or notify the user here
    } catch (error) {
        console.error('Error downloading file:', error);
        // Optional: Handle error or notify the user
    }
};
