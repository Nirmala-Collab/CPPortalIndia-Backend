import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
class AuditLog extends Model {}
AuditLog.init(
 {
   id: {
     type: DataTypes.UUID,
     primaryKey: true,
     defaultValue: DataTypes.UUIDV4,
   },
   user_id: {
     type: DataTypes.UUID,
     allowNull: true,
   },
   email: {
     type: DataTypes.STRING(255),
     allowNull: true,
   },
   phone: {
     type: DataTypes.STRING(20),
     allowNull: true,
   },
   action: {
     type: DataTypes.STRING(50),   // LOGIN, SEND_OTP, VERIFY_OTP, LOGOUT
     allowNull: false,
   },
   status: {
     type: DataTypes.STRING(20),   // SUCCESS | FAILED
     allowNull: false,
   },
   reason: {
     type: DataTypes.TEXT,         // Human-readable reason
     allowNull: false,
   },
   failure_code: {
     type: DataTypes.STRING(50),   // LOGIN_001, OTP_002, AD_001, etc.
     allowNull: true,
   },
   ip_address: {
     type: DataTypes.STRING(100),
     allowNull: true,
   },
   user_agent: {
     type: DataTypes.TEXT,
     allowNull: true,
   },
   created_at: {
     type: DataTypes.DATE,
     defaultValue: DataTypes.NOW,
   },
 },
 {
   sequelize,
   modelName: "AuditLog",
   tableName: "audit_logs",
   timestamps: false, // we already store created_at manually
 }
);
export default AuditLog;