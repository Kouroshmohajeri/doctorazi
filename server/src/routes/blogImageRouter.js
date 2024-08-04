import express from 'express';
import { uploadImage, getImages, deleteImage } from '../controllers/blogImageController.js';

const router = express.Router();

router.post('/upload', uploadImage);
router.get('/images', getImages);
router.delete('/delete', deleteImage);

export default router;
