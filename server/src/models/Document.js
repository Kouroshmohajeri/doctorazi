import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Document = sequelize.define(
  "Document",
  {
    documentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    aboutUsEnglish: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    aboutUsFarsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactUsEnglish: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactUsFarsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    termsAndConditionsEnglish: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    termsAndConditionsFarsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    privacyPolicyEnglish: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    privacyPolicyFarsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Documents",
    timestamps: true,
  }
);

export default Document;
