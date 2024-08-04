import express from 'express';
import DocumentController from '../controllers/documentController.js';

const router = express.Router();
const documentController = new DocumentController();

router.post('/create', documentController.createDocument);
router.get('/:id', documentController.getDocumentById);
router.get('/user/:userId', documentController.getDocumentsByUserId);
router.put('/update/:id', documentController.updateDocument);
router.delete('/delete/:id', documentController.deleteDocument);

export default router;