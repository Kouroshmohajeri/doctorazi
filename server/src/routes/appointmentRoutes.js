import express from 'express';
import AppointmentController from "../controllers/appointmentController.js"

const router = express.Router();
const appointmentController = new AppointmentController();

// Endpoint to create a new appointment
router.post('/new', appointmentController.createAppointment);

// Endpoint to update an existing appointment
router.put('/update/:id', appointmentController.updateAppointment);

// Endpoint to delete an existing appointment
router.delete('/delete/:id', appointmentController.deleteAppointment);

// Endpoint to get all appointments
router.get('/getAll', appointmentController.getAllAppointments);

// Fetch appointments for a specific client
router.get('/getByClient/:clientId', appointmentController.getAppointmentsByClient);

// Fetch appointments for a specific physician
router.post('/getByPhysician/:physicianId', appointmentController.getAppointmentsByPhysicianId);



export default router;
