import ZoomMeeting from '../models/ZoomMeetings.js';

class ZoomMeetingRepository {
    async createMeeting(meetingDetails) {
        try {
            return await ZoomMeeting.create(meetingDetails);
        } catch (error) {
            console.error("Error creating Zoom meeting:", error);
            throw new Error('Failed to create Zoom meeting');
        }
    }

    async findMeetingById(meetingId) {
        try {
            return await ZoomMeeting.findByPk(meetingId);
        } catch (error) {
            console.error("Error finding Zoom meeting:", error);
            throw new Error('Failed to find Zoom meeting');
        }
    }

    async deleteMeeting(meetingId) {
        try {
            const meeting = await this.findMeetingById(meetingId);
            if (meeting) {
                await meeting.destroy();
                return { message: 'Meeting deleted successfully' };
            }
            throw new Error('Meeting not found');
        } catch (error) {
            console.error("Error deleting Zoom meeting:", error);
            throw new Error('Failed to delete Zoom meeting');
        }
    }

    async updateMeeting(meetingId, updateDetails) {
        try {
            const meeting = await this.findMeetingById(meetingId);
            if (meeting) {
                return await meeting.update(updateDetails);
            }
            throw new Error('Meeting not found');
        } catch (error) {
            console.error("Error updating Zoom meeting:", error);
            throw new Error('Failed to update Zoom meeting');
        }
    }

    async findAllMeetings() {
        try {
            return await ZoomMeeting.findAll();
        } catch (error) {
            console.error("Error fetching all Zoom meetings:", error);
            throw new Error('Failed to fetch all Zoom meetings');
        }
    }
}

export default new ZoomMeetingRepository();
