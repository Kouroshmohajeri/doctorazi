import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Doctor from './Doctor.js'

const Calendar = sequelize.define('Calendar', {
  calendar_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id'
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  available: {
    type:DataTypes.STRING,
    allowNull:false
  }
}, {
  tableName: 'Calendar',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Calendar;