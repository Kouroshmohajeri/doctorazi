import express from 'express';
import * as translatorController from '../controllers/translatorController.js';

const router = express.Router();

router.post('/add', translatorController.createTranslator);
router.get('/getById/:id', translatorController.getTranslatorById);
router.get('/getAll', translatorController.getAllTranslators);
router.put('/update/:id', translatorController.updateTranslator);
router.get('/getByUserId/:userId', translatorController.getTranslatorByUserId);
router.delete('/delete/:id', translatorController.deleteTranslator);

export default router;
