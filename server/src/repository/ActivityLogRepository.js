import ActivityLog from '../models/ActivityLog';

class ActivityLogRepository {
  async logActivity(activityData) {
    try {
      return await ActivityLog.create(activityData);
    } catch (error) {
      throw new Error('Error logging activity');
    }
  }

}

export default new ActivityLogRepository();
