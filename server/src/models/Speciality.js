// Speciality model
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Speciality = sequelize.define(
  "Speciality",
  {
    speciality_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    translate: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null to indicate no translation
    },
  },
  {
    tableName: "Specialities",
  }
);

export default Speciality;
