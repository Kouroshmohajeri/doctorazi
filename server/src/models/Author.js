import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Author = sequelize.define('Author', {
  authorId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  blogsList: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  isHeadAuthor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Authors',
  timestamps: true,
});

export default Author;
