import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Doctor from './Doctor.js';

const Biography = sequelize.define('Biography', {
  biography_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id',
    },
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  short_description_translated: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  long_description_translated: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  translatedName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'Biography',
  timestamps: true,
});

Doctor.hasMany(Biography, { foreignKey: 'doctor_id' });
Biography.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'Doctor' });

export default Biography;
