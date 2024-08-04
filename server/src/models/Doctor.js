import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 
import User from './User.js';

const Doctor = sequelize.define('Doctor', {
  doctor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_id: {
    type: DataTypes.INTEGER, // This should be INTEGER
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    }
},
speciality_id: {
  type: DataTypes.INTEGER, // This should be INTEGER
  allowNull: false,
},patients: {
  type: DataTypes.TEXT,
  allowNull:true
}
}, {
  timestamps: true ,
  tableName: 'Doctors'
});

Doctor.belongsTo(User, { foreignKey: 'client_id', as: 'ClientDetails' });
export default Doctor;
