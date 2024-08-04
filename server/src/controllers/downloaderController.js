import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Convert the file URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory path
const __dirname = dirname(__filename);

// Define a controller function for handling file downloads
export const downloadFile = (req, res) => {
    const folder = req.params.folder;
    const file = req.params.file;
    const filePath = join(__dirname, '..', 'public', 'prescription', folder, file); // Adjust the path as per your file storage

    // Set the appropriate headers for downloading the file
    res.setHeader('Content-Disposition', `attachment; filename="${file}"`);

    // Send the file as the response
    res.sendFile(filePath);
};
