import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const RoleAccessRight = sequelize.define(
    "RoleAccessRight",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roleType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "role_type",
        },
        accessRightId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "access_right_id",
        },
    },
    {
        tableName: "role_access_rights",
        underscored: true,
        timestamps: true,
    }
);
export default RoleAccessRight;