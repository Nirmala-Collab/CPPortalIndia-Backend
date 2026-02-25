import { DataTypes } from 'sequelize';

import sequelize from '../config/db.js';
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: false,
    },
    clientGroupId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'client_group_id',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date',
    },
    relationshipManager: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'relationship_manager',
    },
    claimsManager: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'claims_manager',
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'role_id',
    },
    authTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'auth_type_id',
    },
    userType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'user_type',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'deleted',
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_photo',
    },
    policyAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'policy_accepted',
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
);
export default User;
