import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/db.js';
class AuthenticationType extends Model {}
AuthenticationType.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AuthenticationType',
    tableName: 'authentication_types',
    timestamps: true,
    underscored: true,
  }
);
export default AuthenticationType;
