import express from 'express';
import ZoomMeetingController from '../controllers/zoomMeetingsController.js';

const router = express.Router();

router.post('/meetings', ZoomMeetingController.createMeeting);
router.get('/meetings/:id', ZoomMeetingController.getMeeting);
router.delete('/meetings/:id', ZoomMeetingController.deleteMeeting);
router.put('/meetings/:id', ZoomMeetingController.updateMeeting);
router.get('/meetings', ZoomMeetingController.getAllMeetings);

export default router;
