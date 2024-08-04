import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profileImageController = {
  getAllFolders: (req, res) => {
    const publicPath = path.join(__dirname, '..', 'public', 'profileImage');
    fs.readdir(publicPath, (err, files) => {
      if (err) {
        console.error('Error reading folders:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      const folders = files.filter((file) => fs.lstatSync(path.join(publicPath, file)).isDirectory());
      res.status(200).json({ status: 'success', folders });
    });
  },
  getRecordsRoute: (req,res) => {
    const {fileName} = req.params;
    const filePath = path.join(__dirname, '..', 'public', 'profileImage', fileName);
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.error('Error reading files:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', files });
    });
  },
  getFoldersByUserId: (req, res) => {
    const { user_id } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'profileImage');
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folders:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      const userFolders = files.filter((folder) => folder.startsWith(`pi_${user_id}`));
      res.status(200).json({ status: 'success', userFolders });
    });
  },
  deleteFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'profileImage', folderName);
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting folder:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', message: 'Folder deleted successfully' });
    });
  },
  deleteFile: (req, res) => {
    const { folderName, fileName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'profileImage', folderName);
    const filePath = path.join(folderPath, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        res.status(200).json({ status: 'success', message: 'File deleted successfully' });
      });
    } else {
      res.status(404).json({ status: 'error', message: 'File not found' });
    }
  },
  deleteAllProfileImageFiles: (req,res)=>{
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'profileImage', folderName);
    
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        
        // Iterate through all files in the folder and delete them
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
        });

        res.status(200).json({ status: 'success', message: 'All files deleted successfully' });
    });
  },
  getFilesInFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'profileImage', folderName);
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading files in folder:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', files });
    });
  }
  
};

export default profileImageController;
