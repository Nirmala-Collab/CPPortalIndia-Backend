// src/models/company.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class Company extends Model {}
Company.init(
 {
   id: {
     type: DataTypes.UUID,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
     allowNull: false,
   },
   companyName: {
     type: DataTypes.STRING(255),
     allowNull: false,
     field: "company_name",
   },
   corporateId: {
     type: DataTypes.UUID,
     allowNull: false,
     field: "corporate_id",
   },
   isActive: {
     type: DataTypes.BOOLEAN,
     defaultValue: true,
     field: "is_active",
   },
 },
 {
   sequelize,              // 🔴 REQUIRED
   modelName: "Company",
   tableName: "companies",
   underscored: true,
   timestamps: true,
 }
);
export default Company;