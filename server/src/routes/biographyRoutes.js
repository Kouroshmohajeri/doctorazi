import express from 'express';
import BiographyController from '../controllers/biographyController.js';

const router = express.Router();

// Add biography route
router.post('/add', BiographyController.add);

// Update biography route
router.put('/update/:biography_id', BiographyController.update);

// Delete biography route
router.delete('/delete/:id', BiographyController.delete);

// Get all biographies route
router.get('/all', BiographyController.getAll);

// Get biography by ID route
router.get('/getById/:id', BiographyController.getOne);

// Get biography by Doctor ID route
router.get('/getByDoctorId/:doctor_id', BiographyController.getByDoctorId);

export default router;
