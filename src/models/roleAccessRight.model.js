// src/models/roleAccessRight.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class RoleAccessRight extends Model { }
RoleAccessRight.init(
    {
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: "is_enabled",
        },
    },
    {
        sequelize,
        modelName: "RoleAccessRight",
        tableName: "role_access_rights",
        timestamps: true,
        underscored: true,
    }
);
export default RoleAccessRight;