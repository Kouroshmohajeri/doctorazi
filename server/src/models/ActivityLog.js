import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const ActivityLog = sequelize.define('ActivityLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default ActivityLog;
