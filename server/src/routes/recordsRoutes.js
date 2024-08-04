import express from 'express';
import recordsController from '../controllers/recordsController.js';

const router = express.Router();

// Get all folders
router.get('/folders', recordsController.getAllFolders);
// Get folders based on user id
router.get('/folders/:user_id', recordsController.getFoldersByUserId);
// Delete a folder
router.delete('/folders/:folderName', recordsController.deleteFolder);
// Get a folder
router.get('/files/:folderName', recordsController.getFilesInFolder);
// Get a record
router.get('/recordImage/:fileName',recordsController.getRecordsRoute);
// Delete a file from a folder
router.delete('/files/:folderName/:fileName', recordsController.deleteFile);
// Get folders by user IDs
router.post('/folders', recordsController.getFoldersByUserIds);

export default router;
