import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const ClinicalRecord = sequelize.define('ClinicalRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'client_id', 
    },
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_upload: {
    type: DataTypes.DATE, 
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  
});

export default ClinicalRecord;
