// src/seed/authenticationTypes.seed.js
import db from "../models/index.js";
export async function seedAuthenticationTypes() {
 const { AuthenticationType } = db;
 const defaultTypes = [
   { name: "OTP", description: "Email OTP login" },
   { name: "phone", description: "Phone OTP login" },
   { name: "AD Password", description: "Azure Directory login" },
 ];
 for (const type of defaultTypes) {
   const exists = await AuthenticationType.findOne({
     where: { name: type.name },
   });
   if (!exists) {
     await AuthenticationType.create(type);
     console.log(`➡️ Added auth type: ${type.name}`);
   }
 }
}