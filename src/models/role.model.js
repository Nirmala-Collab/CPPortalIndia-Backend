// src/models/role.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class Role extends Model {}
Role.init(
 {
   id: {
     type: DataTypes.UUID,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
   },
   // Example: "Admin", "SuperAdmin", "CorporateAdmin"
   roleType: {
     type: DataTypes.STRING(100),
     allowNull: false,
     unique: true,
     field: "role_type",
   },
   // Example: "internal", "external", "business"
   roleName: {
     type: DataTypes.STRING(50),
     allowNull: false,
     field: "role_name",
   },
   description: {
     type: DataTypes.TEXT,
     allowNull: true,
   },
 },
 {
   sequelize,
   modelName: "Role",
   tableName: "roles",
   timestamps: true,
   underscored: true,
 }
);
export default Role;