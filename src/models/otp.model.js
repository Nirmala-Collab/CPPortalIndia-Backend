// src/models/otp.model.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import { defaultValueSchemable } from "sequelize/lib/utils";
class Otp extends Model { }
Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // FK -> users.id
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    // 5-digit OTP (we'll store as string)
    otpCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "otp_code",
    },
    // EMAIL / PHONE
    otpType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "otp_type",
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "otp_attempts"
    },
    locked:
    {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "account_lock"
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "lock_expiry"
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: "is_used",
    },
  },
  {
    sequelize,
    modelName: "Otp",
    tableName: "otps",
    timestamps: true,   // created_at
    underscored: true,
    // ❗ IMPORTANT: no custom indexes for now.
  }
);
export default Otp;