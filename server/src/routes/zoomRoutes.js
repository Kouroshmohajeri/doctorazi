// routes/zoomRoutes.js
import express from 'express';
import ZoomController from '../controllers/zoomController.js';

const router = express.Router();

// Route for fetching Zoom meetings
router.get('/meetings', async (req, res) => {
  try {
    const meetings = await ZoomController.getMeetings();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Zoom meetings', error: error.toString() });
  }
});

// Route for creating a Zoom meeting
router.post('/createMeeting', async (req, res) => {
  try {
    const { topic, start_time, type, duration, timezone, agenda } = req.body;
    const meeting = await ZoomController.createMeeting(topic, start_time, type, duration, timezone, agenda);
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Zoom meeting', error: error.toString() });
  }
});

export default router;
