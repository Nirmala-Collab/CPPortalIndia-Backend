import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/db.js';
class Role extends Model {}
Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    roleType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'role_type',
    },

    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'role_name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    underscored: true,
  }
);
export default Role;
