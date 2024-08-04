import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const OAuthRefreshToken = sequelize.define('OAuthRefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'user_id',
    },
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default OAuthRefreshToken;
