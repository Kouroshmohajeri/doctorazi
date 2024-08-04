import express from 'express';
import calendarController from '../controllers/calendarController.js';
const router = express.Router();

// Add to calnedar
router.post('/add', calendarController.addCalendar);

// Update calendar
router.put('/update/:calendar_id', calendarController.updateCalendar);

// Delete a day
router.delete('/delete/:calendar_id', calendarController.deleteCalendar);

// Get all days
router.get('/getAll', calendarController.getAllCalendars);

// Get by calendar_id
router.get('/getByCalendarId/:calendar_id', calendarController.getCalendarById);

// Get by date and doctorId
router.get('/getByDoctorIdDate/:doctor_id', calendarController.getCalendarsByDoctorIdAndDate);

// Get by time, date and doctorId
router.get('/getByDoctorIdDateTime/:doctor_id', calendarController.getCalendarsByDoctorIdAndDateAndTime);

// Get by doctor_id
router.get('/getByDoctorId/:doctor_id', calendarController.getCalendarsByDoctorId);

// Get by date
router.get('/getByDate/:date', calendarController.getCalendarsByDate);

// Get by time
router.get('/getByTime/:time', calendarController.getCalendarsByTime);

export default router;
