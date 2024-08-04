import ZoomMeetingRepository from '../repository/zoomMeetingsRepository.js';

class ZoomMeetingController {
    async createMeeting(req, res) {
        try {
            const meeting = await ZoomMeetingRepository.createMeeting(req.body);
            res.status(201).json(meeting);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMeeting(req, res) {
        try {
            const meeting = await ZoomMeetingRepository.findMeetingById(req.params.id);
            if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
            res.json(meeting);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteMeeting(req, res) {
        try {
            const response = await ZoomMeetingRepository.deleteMeeting(req.params.id);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateMeeting(req, res) {
        try {
            const meeting = await ZoomMeetingRepository.updateMeeting(req.params.id, req.body);
            res.json(meeting);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllMeetings(req, res) {
        try {
            const meetings = await ZoomMeetingRepository.findAllMeetings();
            res.json(meetings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ZoomMeetingController();
