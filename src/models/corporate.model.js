// src/models/corporate.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class Corporate extends Model {}
Corporate.init(
 {
   id: {
     type: DataTypes.UUID,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
   },
   corporateName: {
     type: DataTypes.STRING(255),
     allowNull: false,
     field: "corporate_name",
   },
   groupName: {
     type: DataTypes.STRING(255),
     allowNull: true,
     field: "group_name",
   },
   zoneName: {
     type: DataTypes.STRING(255),
     allowNull: true,
     field: "zone_name",
   },
   companyLevel: {
     type: DataTypes.STRING(255),
     allowNull: true,
     field: "company_level",
   },
   // We’ll keep logo field for later (BYTEA)
   isActive: {
     type: DataTypes.BOOLEAN,
     defaultValue: true,
     field: "is_active",
   },
 },
 {
   sequelize,
   modelName: "Corporate",
   tableName: "corporates",
   timestamps: true,
   underscored: true,
 }
);
export default Corporate;