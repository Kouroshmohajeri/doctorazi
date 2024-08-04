import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prescriptionsController = {
  getAllFolders: (req, res) => {
    const publicPath = path.join(__dirname, '..', 'public', 'prescriptions');
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
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'public', 'prescriptions', fileName);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ status: 'error', message: 'File not found' });
    }
  },
  getFoldersByUserId: (req, res) => {
    const { user_id } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'prescription');
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folders:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      const userFolders = files.filter((folder) => folder.startsWith(`pr_${user_id}`));
      res.status(200).json({ status: 'success', userFolders });
    });
  },
  getFilesInFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'prescription', folderName); 
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading files:', err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
      res.status(200).json({ status: 'success', files });
    });
  },
  deleteFolder: (req, res) => {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'public', 'prescription', folderName);
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
    const folderPath = path.join(__dirname, '..', 'public', 'prescription', folderName);
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
  getFoldersByUserIds: async (req, res) => {
    try {
      const { user_ids } = req.body;

      const foldersByUser = [];

      for (const user_id of user_ids) {
        const folderPath = path.join(__dirname, '..', 'public', 'prescriptions');
        const files = await fs.promises.readdir(folderPath);
        const userFolders = files.filter((folder) => folder.startsWith(`pr_${user_id}`));
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
};

export default prescriptionsController;
