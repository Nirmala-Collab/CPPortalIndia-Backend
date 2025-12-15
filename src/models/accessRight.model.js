import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const AccessRight = sequelize.define(
  "AccessRight",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rightName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      field: "right_name",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "access_rights",
    underscored: true,
    timestamps: true,
  }
);

export default AccessRight;
 