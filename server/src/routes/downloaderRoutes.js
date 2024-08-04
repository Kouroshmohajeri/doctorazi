import express from 'express';
import { downloadFile } from '../controllers/downloaderController.js';

const router = express.Router();

// Define a route to handle file downloads
router.get('/:folder/:file', downloadFile);

export default router;