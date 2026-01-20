import db from "../models/index.js";
const { AuditLog } = db;
export async function logAudit({
 user = null,
 email = null,
 phone = null,
 action,
 status,
 reason,
 failure_code = null,
 req
}) {
 try {
   await AuditLog.create({
     user_id: user?.id || null,
     email: user?.email || email || null,
     phone: user?.phone || phone || null,
     action,
     status,
     reason,
     failure_code,
     ip_address: req?.ip,
     user_agent: req?.headers["user-agent"],
   });
 } catch (err) {
   console.error("Audit Log Error:", err.message);
 }
}