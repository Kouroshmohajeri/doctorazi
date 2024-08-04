import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js'; // Import the User model

const ZoomMeeting = sequelize.define('ZoomMeeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id' 
    }
  },
  meetingId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  topic: DataTypes.STRING,
  startTime: DataTypes.DATE,
  duration: DataTypes.INTEGER,
  joinUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Model options
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
});
User.hasMany(ZoomMeeting, { foreignKey: 'user_id' });
ZoomMeeting.belongsTo(User, { foreignKey: 'user_id' });

export default ZoomMeeting;
