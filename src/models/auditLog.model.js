export default (sequelize, DataTypes) => {
 const AuditLog = sequelize.define("AuditLog", {
   id: {
     type: DataTypes.UUID,
     defaultValue: sequelize.literal("gen_random_uuid()"),
     primaryKey: true,
   },
   user_id: DataTypes.UUID,
   email: DataTypes.STRING,
   phone: DataTypes.STRING,
   action: DataTypes.STRING,
   status: DataTypes.STRING,
   reason: DataTypes.TEXT,
   failure_code: DataTypes.STRING,
   ip_address: DataTypes.STRING,
   user_agent: DataTypes.TEXT,
   created_at: {
     type: DataTypes.DATE,
     defaultValue: sequelize.literal("NOW()"),
   },
 }, {
   tableName: "audit_logs",
   timestamps: false,
 });
 return AuditLog;
};