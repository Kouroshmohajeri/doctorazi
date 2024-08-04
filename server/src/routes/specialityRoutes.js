import express from 'express';
import SpecialityController from '../controllers/specialityController.js';

const router = express.Router();

// Route to create a new Speciality
router.post('/add', SpecialityController.create);

// Route to get a Speciality by ID
router.get('/getById/:id', SpecialityController.get);

// Route to get the translation of a Speciality by ID
router.get('/getTranslate/:id/translate', SpecialityController.getTranslation)

// Route to get the original form of a Speciality by ID
router.get('/getOriginal/:id/original', SpecialityController.getOriginal);

// Route to get both original and translated form of a Speciality by ID
router.get('/bothOriginalTranslated/:id/both', SpecialityController.getBothForms);

// Route to list all Specialities
router.get('/getAll', SpecialityController.list);

// Route to update a Speciality
router.put('/update/:id', SpecialityController.update);

// Route to delete a Speciality
router.delete('/delete/:id', SpecialityController.delete);

export default router;
