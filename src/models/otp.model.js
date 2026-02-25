import { DataTypes, Model } from 'sequelize';
import { defaultValueSchemable } from 'sequelize/lib/utils';

import sequelize from '../config/db.js';
class Otp extends Model {}
Otp.init(
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
    otpCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'otp_code',
    },
    otpType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'otp_type',
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'otp_attempts',
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'account_lock',
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lock_expiry',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_used',
    },
  },
  {
    sequelize,
    modelName: 'Otp',
    tableName: 'otps',
    timestamps: true,
    underscored: true,
  }
);
export default Otp;
