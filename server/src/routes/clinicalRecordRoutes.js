// Routing for managing clinical records
import express from 'express';
import ClinicalRecordController from '../controllers/clinicalRecordController.js';

const router = express.Router();
const clinicalRecordController = new ClinicalRecordController();

// Endpoint to create a new clinical record
router.post('/new', clinicalRecordController.createClinicalRecord);

// Endpoint to update an existing clinical record
router.put('/updateRecord/:id', clinicalRecordController.updateClinicalRecord);

// Endpoint to delete an existing clinical record
router.delete('/deleteRecord/:id', clinicalRecordController.deleteClinicalRecord);

// Endpoint to get a single clinical record by ID
router.get('/getRecord/:id', clinicalRecordController.getClinicalRecord);

// Endpoint to get all clinical records
router.get('/getAllRecords', clinicalRecordController.getAllClinicalRecords);

export default router;
