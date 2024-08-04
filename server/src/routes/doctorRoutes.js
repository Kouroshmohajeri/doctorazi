import express from 'express';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.post('/new', doctorController.createDoctor);
router.get('/getAll', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctor); // Get a single doctor by id
router.get('/doctorBySpecialityId/:id', doctorController.getDoctorBySpecialityId); // Get a single doctor by id
router.put('/update/:id', doctorController.updateDoctor); // Update a doctor by id
router.delete('/doctors/:id', doctorController.deleteDoctor); // Delete a doctor by id
router.post('/doctorByClientId/:clientId', doctorController.getDoctorByClientId) //Get id by client_id
router.get('/patients/:clientId', doctorController.findPatientsByClientId); // Get patients by client_id(fk)
router.delete('/patients/:clientId', doctorController.removePatientFromClient); // Delete patient from list



export default router;
