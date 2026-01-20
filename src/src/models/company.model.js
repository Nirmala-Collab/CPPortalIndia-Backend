// src/models/company.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class Company extends Model { }
Company.init(
  {
    clientId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: "client_id"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "company_name",
    },
    clientGroupId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "client_group_id",
    },
    activeFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "active_flag",
    },
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    underscored: true,
    timestamps: true,
  }
);
export default Company;