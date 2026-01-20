// src/models/corporate.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class Corporate extends Model { }
Corporate.init(
  {
    clientGroupId: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "client_group_id"

    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "corporate_name",
    },

    activeFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "active_flag",
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