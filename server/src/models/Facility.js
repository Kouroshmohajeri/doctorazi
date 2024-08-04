import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Facility = sequelize.define('Facility', {
  facility_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'doctors',
      key: 'doctor_id',
    },
  },
  name: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
}, {
  tableName: 'facilities',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export default Facility;
