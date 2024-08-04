import express from 'express';
import { handleFileUpload, upload } from '../controllers/uploadController.js';

const router = express.Router();

// router.post('/clinicalRecord/:user_id', upload.array('file'), handleFileUpload);
router.post('/files/:user_id/:folder/:prefix', upload.array('file'), handleFileUpload);


export default router;
