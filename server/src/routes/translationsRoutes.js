// routes/translationsRoutes.js
import express from 'express';
import * as translationsController from '../controllers/translationsController.js';

const router = express.Router();

router.post('/add', translationsController.createTranslation);
router.get('/getById/:id', translationsController.getTranslationById);
router.get('/getAll', translationsController.getAllTranslations);
router.put('/update/:id', translationsController.updateTranslation);
router.delete('/delete/:id', translationsController.deleteTranslation);

export default router;
