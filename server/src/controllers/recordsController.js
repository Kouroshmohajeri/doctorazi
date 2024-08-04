import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const recordsController = {
  // Get all the folders with the pictures in them
  getAllFolders: (req, res) => {
    const publicPath = path.join(__dirname, '..', 'public', 'crecord'); // Update folder name here
    fs.readdir(publicPath, (err, files) => {
      if (err) {
        console.error('Error reading folders:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      const folders = files.filter((file) => fs.lstatSync(path.join(publicPath, file)).isDirectory());
      res.status(200).json({ status: 'success', folders });
    });
  },
  // Get Records Route
  getRecordsRoute: (req,res) =>{
    const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '..', 'public', 'crecord', fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    // If the file does not exist, send a 404 error
    res.status(404).json({ status: 'error', message: 'File not found' });
  }
  },
  // Get all the folders that match the user_id
  getFoldersByUserId: (req, res) => {
    const { user_id } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'crecord'); // Update folder name here
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folders:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      const userFolders = files.filter((folder) => folder.startsWith(`cr_${user_id}`));
      res.status(200).json({ status: 'success', userFolders });
    });
  },

  getFilesInFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'crecord', folderName); 
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading files:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', files });
    });
  },
  

  // Delete a folder and its contents
  deleteFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'crecord', folderName); // Update folder name here
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting folder:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', message: 'Folder deleted successfully' });
    });
  },
  // Delete a file from a folder
  deleteFile: (req, res) => {
    const { folderName, fileName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'crecord', folderName);
    const filePath = path.join(folderPath, fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Attempt to delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        // File deletion successful
        res.status(200).json({ status: 'success', message: 'File deleted successfully' });
      });
    } else {
      // If the file does not exist, send a 404 error
      res.status(404).json({ status: 'error', message: 'File not found' });
    }
  },
// Get folders by user IDs
getFoldersByUserIds: async (req, res) => {
  try {
    const { user_ids } = req.body;

    const foldersByUser = [];

    for (const user_id of user_ids) {
      const folderPath = path.join(__dirname, '..', 'public', 'crecord');
      const files = await fs.promises.readdir(folderPath);
      const userFolders = files.filter((folder) => folder.startsWith(`cr_${user_id}`));
      foldersByUser.push({ user_id, folders: userFolders });
    }

    const folders = foldersByUser.reduce((acc, cur) => {
      acc.push(...cur.folders);
      return acc;
    }, []);

    res.status(200).json({ status: 'success', foldersByUser, folders });
  } catch (error) {
    console.error('Error getting folders by user IDs:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
}

export default recordsController;
