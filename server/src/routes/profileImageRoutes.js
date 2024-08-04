import express from 'express';
import profilePictureController from '../controllers/profileImageController.js';

const router = express.Router();

// Get all folders route
router.get('/folders', profilePictureController.getAllFolders);

// Get records route
router.get('/records/:fileName', profilePictureController.getRecordsRoute);

// Get folders by user ID route
router.get('/folders/:user_id', profilePictureController.getFoldersByUserId);

// Delete folder route
router.delete('/folders/:folderName', profilePictureController.deleteFolder);

// Delete file route
router.delete('/files/:folderName/:fileName', profilePictureController.deleteFile);

// Delete all files in folder route
router.delete('/folder/:folderName/files', profilePictureController.deleteAllProfileImageFiles);

// Get files in folder route
router.get('/folder/:folderName/files', profilePictureController.getFilesInFolder);


export default router;
