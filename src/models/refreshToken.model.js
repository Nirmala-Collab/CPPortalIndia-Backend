import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/db.js';
class RefreshToken extends Model {}
RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
  }
);
export default RefreshToken;
