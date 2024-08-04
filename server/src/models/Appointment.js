import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js'; 
import Doctor from './Doctor.js';

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  physician_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id',
    },
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  host_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Additional appointment fields will be added if needed
});
Doctor.hasMany(Appointment, { foreignKey: 'physician_id' });
User.hasMany(Appointment,{foreignKey:'client_id'});
Appointment.belongsTo(Doctor, { foreignKey: 'physician_id', as: 'Physician' });
Appointment.belongsTo(User,{foreignKey:'client_id', as:'Client'});

export default Appointment;
