import express from 'express';
import prescriptionsController from '../controllers/prescriptionController.js';


const router = express.Router();

// Route to get all folders in the prescriptions directory
router.get('/allFolders', prescriptionsController.getAllFolders);

// Route to get a specific file in the prescriptions directory
router.get('/:fileName', prescriptionsController.getRecordsRoute);

// Route to get folders by user ID
router.get('/folders/:user_id', prescriptionsController.getFoldersByUserId);

// Route to get files in a specific folder
router.get('/files/:folderName', prescriptionsController.getFilesInFolder);

// Route to delete a folder
router.delete('/deleteFolder/:folderName', prescriptionsController.deleteFolder);

// Route to delete a file
router.delete('/deleteFile/:folderName/:fileName', prescriptionsController.deleteFile);

// Route to get folders by user IDs
router.post('/foldersByUserIds', prescriptionsController.getFoldersByUserIds);

export default router;
