// models/Role.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'roles',
});

export default Role;
