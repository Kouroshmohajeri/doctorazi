import express from 'express';
import FacilityController from '../controllers/facilityController.js';

const router = express.Router();

// Add facility route
router.post('/add', FacilityController.add);

// Update facility route
router.put('/update/:id', FacilityController.update);

// Delete facility route
router.delete('/delete/:id', FacilityController.delete);

// Get all facilities route
router.get('/all', FacilityController.getAll);

// Get facility by ID route
router.get('/getById/:id', FacilityController.getOne);

// Get facility by Doctor ID route
router.get('/getByDoctorId/:doctor_id', FacilityController.getByDoctorId);

export default router;
