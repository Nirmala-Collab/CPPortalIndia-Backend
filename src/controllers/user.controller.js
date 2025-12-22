import db from "../models/index.js";
const {
 User,
 Role,
 Corporate,
 Company,
 AuthenticationType,
 AccessRight,
} = db;
/**
* ----------------------------------------------------
* CREATE USER
* ----------------------------------------------------
*/
export async function createUser(req, res) {
 try {
   const {
     fullName,
     email,
     phone,
     roleId,
     corporateId,
     companyId,
     relationshipManager,
     claimsManager,
     endDate,
     authTypeId,
     accessRights,
     isActive,
   } = req.body;
   /* -------------------- BASIC REQUIRED VALIDATION -------------------- */
   if (
     !fullName ||
     !email ||
     !phone ||
     !roleId ||
     !corporateId ||
     !companyId ||
     !relationshipManager ||
     !claimsManager ||
     !endDate ||
     !authTypeId ||
     isActive === undefined
   ) {
     return res.status(400).json({
       message: "All fields are mandatory for create user",
     });
   }
   if (!Array.isArray(accessRights) || accessRights.length === 0) {
     return res.status(400).json({
       message: "At least one access right must be selected",
     });
   }
   /* -------------------- PHONE VALIDATION -------------------- */
   if (!/^\d{10}$/.test(phone)) {
     return res.status(400).json({
       message: "Phone number must be exactly 10 digits",
     });
   }
   /* -------------------- EMAIL VALIDATION -------------------- */
   const emailLower = email.toLowerCase();
   // Block personal emails
  //  const blockedDomains = [
  //    "gmail.com",
  //    "yahoo.com",
  //    "outlook.com",
  //    "hotmail.com",
  //  ];
   const emailDomain = emailLower.split("@")[1];
   if (!emailDomain) {
     return res.status(400).json({ message: "Invalid email format" });
   }
  //  if (blockedDomains.includes(emailDomain)) {
  //    return res.status(400).json({
  //      message: "Personal email IDs are not allowed",
  //    });
  //  }
   // Internal Lockton domains
   const internalDomains = [
     "lockton.com",
   ];
   // External allowed TLDs
   const allowedExternalTlds = [".com", ".co.in", ".in"];
   let userType = "EXTERNAL";
   if (internalDomains.includes(emailDomain)) {
     userType = "INTERNAL";
   } else {
     const validExternal = allowedExternalTlds.some((tld) =>
       emailDomain.endsWith(tld)
     );
     if (!validExternal) {
       return res.status(400).json({
         message:
           "Invalid corporate email domain. Only .com, .co.in, .in allowed",
       });
     }
   }
   /* -------------------- DUPLICATE CHECKS -------------------- */
   const existingEmail = await User.findOne({ where: { email } });
   if (existingEmail) {
     return res.status(400).json({ message: "Email already exists" });
   }
   const existingPhone = await User.findOne({ where: { phone } });
   if (existingPhone) {
     return res.status(400).json({ message: "Phone number already exists" });
   }
   /* -------------------- CREATE USER -------------------- */
   const user = await User.create({
     fullName,
     email,
     phone,
     userType,
     roleId,
     corporateId,
     companyId,
     relationshipManager,
     claimsManager,
     endDate,
     isActive,
     authTypeId,
   });
   /* -------------------- ASSIGN ACCESS RIGHTS -------------------- */
   await user.setAccessRights(accessRights);
   return res.status(201).json({
     message: "User created successfully",
     user,
   });
 } catch (error) {
   console.error("Create User Error:", error);
   return res.status(500).json({
     message: "Internal server error",
   });
 }
}
/**
* ----------------------------------------------------
* UPDATE USER (ALL FIELDS REQUIRED)
* ----------------------------------------------------
*/
export async function updateUser(req, res) {
 try {
   const  userId  = req.params.id;
   const {
     fullName,
     phone,
     roleId,
     corporateId,
     companyId,
     relationshipManager,
     claimsManager,
     endDate,
     authTypeId,
     accessRights,
     isActive,
   } = req.body;
   // Mandatory validation
   if (
     !fullName ||
     !phone ||
     !roleId ||
     !corporateId ||
     !companyId ||
     !relationshipManager ||
     !claimsManager ||
     !endDate ||
     !authTypeId ||
     isActive === undefined
   ) {
     return res.status(400).json({
       message: "All fields are mandatory for update",
     });
   }
   if (!accessRights || accessRights.length === 0) {
     return res
       .status(400)
       .json({ message: "At least one access right must be selected" });
   }
   const user = await User.findByPk(userId);
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   // Check duplicate phone
   const phoneExists = await User.findOne({
     where: { phone },
   });
   if (phoneExists && phoneExists.id !== user.id) {
     return res.status(400).json({ message: "Phone number already exists" });
   }
   // Validate auth type
  //  const authTypeRecord = await AuthenticationType.findOne({
  //    where: { name: authType },
  //  });
  //  if (!authTypeRecord) {
  //    return res.status(400).json({
  //      message: "Invalid authType. Allowed values are email, phone, ad",
  //    });
  //  }
   // Update user
   await user.update({
     fullName,
     phone,
     roleId,
     corporateId,
     companyId,
     relationshipManager,
     claimsManager,
     endDate,
     isActive,
     authTypeId
   });
   // Update access rights
   await user.setAccessRights(accessRights);
   return res.status(200).json({
     message: "User updated successfully",
     user,
   });
 } catch (error) {
   console.error("Update User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/**
* ----------------------------------------------------
* GET ALL USERS (RETURN EVERYTHING)
* ----------------------------------------------------
*/
export async function getUsers(req, res) {
 try {
   const users = await User.findAll({
     include: [
       { model: Role, as: "role" },
       { model: Corporate, as: "corporate" },
       { model: Company, as: "company" },
       { model: AuthenticationType, as: "authType" },
       { model: AccessRight, as: "accessRights" },
     ],
    
   });
   return res.status(200).json(users);
 } catch (error) {
   console.error("Get Users Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/**
* ----------------------------------------------------
* GET SINGLE USER
* ----------------------------------------------------
*/
export async function getUserById(req, res) {
 try {
   const userId  = req.params.id;
   const user = await User.findByPk(userId, {
     include: [
       { model: Role, as: "role" },
       { model: Corporate, as: "corporate" },
       { model: Company, as: "company" },
       { model: AuthenticationType, as: "authType" },
       { model: AccessRight, as: "accessRights" },
     ],
   });
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   return res.status(200).json({ user });
 } catch (error) {
   console.error("Get User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/**
* ----------------------------------------------------
* DELETE USER (SOFT DELETE)
* ----------------------------------------------------
*/
export async function deleteUser(req, res) {
 try {
   const userId  = req.params.id;
   const user = await User.findByPk(userId);
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   await user.update({ isActive: false });
   return res.status(200).json({
     message: "User deactivated successfully",
   });
 } catch (error) {
   console.error("Delete User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}