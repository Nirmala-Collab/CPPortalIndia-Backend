import db from "../models/index.js";
import { resolveUserTypeAndAuthName } from "../utils/userAuthMapping.js";
const {
 User,
 Role,
 Corporate,
 AuthenticationType,
 AccessRight,
} = db;
/* ---------------------------------------------------------
  CREATE USER  (POST /api/users)
--------------------------------------------------------- */
export async function createUser(req, res) {
 try {
   const {
     fullName,
     email,
     phone,
     corporateId,
     roleId,
     authType,           // "AD" | "EMAIL" | "PHONE"
     isActive,
     relationshipManager,
     reportingManager,
     endDate,
     accessRights = []   // array of accessRight ids
   } = req.body;
   /* ------------------ Validation ------------------ */
   if (!fullName || !fullName.trim()) {
     return res.status(400).json({ message: "fullName is required" });
   }
   if (!authType) {
     return res.status(400).json({ message: "authType is required (AD / EMAIL / PHONE)" });
   }
   /* ------------------ Map authType → userType ------------------ */
   let mapping;
   try {
     mapping = resolveUserTypeAndAuthName(authType);
   } catch (err) {
     return res.status(400).json({ message: err.message });
   }
   const { userType, authTypeName } = mapping;
   /* ------------------ Required fields based on authType ------------------ */
   if (authTypeName === "ad" || authTypeName === "email") {
     if (!email) {
       return res.status(400).json({ message: "email is required for AD/Email authType" });
     }
   }
   if (authTypeName === "phone") {
     if (!phone) {
       return res.status(400).json({ message: "phone is required for Phone authType" });
     }
   }
   /* ------------------ Check duplicates ------------------ */
   if (email) {
     const existingEmail = await User.findOne({ where: { email } });
     if (existingEmail) {
       return res.status(400).json({ message: "Email already exists" });
     }
   }
   if (phone) {
     const existingPhone = await User.findOne({ where: { phone } });
     if (existingPhone) {
       return res.status(400).json({ message: "Phone already exists" });
     }
   }
   /* ------------------ Validate role / corporate ------------------ */
   if (roleId) {
     const role = await Role.findByPk(roleId);
     if (!role) return res.status(400).json({ message: "Invalid roleId" });
   }
   if (corporateId) {
     const corp = await Corporate.findByPk(corporateId);
     if (!corp) return res.status(400).json({ message: "Invalid corporateId" });
   }
   /* ------------------ Find AuthenticationType record ------------------ */
   const authTypeRecord = await AuthenticationType.findOne({
     where: { name: authTypeName },
   });
   if (!authTypeRecord) {
     return res.status(400).json({ message: "Invalid authType" });
   }
   /* ------------------ Create User ------------------ */
   const newUser = await User.create({
     fullName,
     email: email || null,
     phone: phone || null,
     corporateId: corporateId || null,
     roleId: roleId || null,
     relationshipManager: relationshipManager || null,
     reportingManager: reportingManager || null,
     endDate: endDate || null,
     isActive: isActive !== undefined ? isActive : true,
     userType,
     authTypeId: authTypeRecord.id,
   });
   /* ------------------ Add Access Rights ------------------ */
  /* ------------ Add Access Rights ------------- */
if (accessRights && accessRights.length > 0) {
 console.log("Received accessRights:", accessRights);
 // Validate rights exist
 const validRights = await AccessRight.findAll({
   where: { id: accessRights }
 });
 if (validRights.length !== accessRights.length) {
   return res.status(400).json({
     message: "One or more accessRight IDs are invalid",
     provided: accessRights,
     valid: validRights.map(r => r.id)
   });
 }
 // Assign only valid rights
 await newUser.setAccessRights(validRights);
}
   return res.status(201).json({
     message: "User created successfully",
     user: newUser,
   });
 } catch (error) {
   console.log("Create User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/* ---------------------------------------------------------
  UPDATE USER (PATCH /api/users/:id)
--------------------------------------------------------- */
export async function updateUser(req, res) {
 try {
   const { id } = req.params;
   const {
     fullName,
     email,
     phone,
     corporateId,
     roleId,
     authType,            // optional: "AD" | "EMAIL" | "PHONE"
     isActive,
     relationshipManager,
     reportingManager,
     endDate,
     accessRights,        // optional: array of accessRight IDs
   } = req.body;
   // 1) Find user
   const user = await User.findByPk(id);
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   // 2) Check duplicate email (if changed)
   if (email && email !== user.email) {
     const existingEmail = await User.findOne({ where: { email } });
     if (existingEmail) {
       return res.status(400).json({ message: "Email already exists" });
     }
     user.email = email;
   }
   // 3) Check duplicate phone (if changed)
   if (phone && phone !== user.phone) {
     const existingPhone = await User.findOne({ where: { phone } });
     if (existingPhone) {
       return res.status(400).json({ message: "Phone already exists" });
     }
     user.phone = phone;
   }
   // 4) Update simple fields if provided
   if (fullName !== undefined) user.fullName = fullName;
   if (relationshipManager !== undefined) user.relationshipManager = relationshipManager;
   if (reportingManager !== undefined) user.reportingManager = reportingManager;
   if (endDate !== undefined) user.endDate = endDate;
   // 5) Validate & update role if sent
   if (roleId !== undefined) {
     if (roleId === null) {
       user.roleId = null;
     } else {
       const role = await Role.findByPk(roleId);
       if (!role) {
         return res.status(400).json({ message: "Invalid roleId" });
       }
       user.roleId = roleId;
     }
   }
   // 6) Validate & update corporate if sent
   if (corporateId !== undefined) {
     if (corporateId === null) {
       user.corporateId = null;
     } else {
       const corp = await Corporate.findByPk(corporateId);
       if (!corp) {
         return res.status(400).json({ message: "Invalid corporateId" });
       }
       user.corporateId = corporateId;
     }
   }
   // 7) If authType sent, recalc userType + authTypeId
 // 7) If authType is sent AND it's a non-empty string, process it

if (authType !== undefined) {

  // If frontend sends null or empty string -> ignore silently

  if (authType === null || authType === "") {

    // do nothing (skip update)

  } else {

    // authType MUST be a string

    if (typeof authType !== "string") {

      return res.status(400).json({

        message: "authType must be a string (AD | EMAIL | PHONE)",

      });

    }

    let mapping;

    try {

      mapping = resolveUserTypeAndAuthName(authType);

    } catch (err) {

      return res.status(400).json({ message: err.message });

    }

    const { userType, authTypeName } = mapping;

    const authTypeRecord = await AuthenticationType.findOne({

      where: { name: authTypeName },

    });

    if (!authTypeRecord) {

      return res.status(400).json({ message: "Invalid authType" });

    }

    user.userType = userType;

    user.authTypeId = authTypeRecord.id;

  }

}
 
   // 8) isActive toggle
   if (isActive !== undefined) {
     user.isActive = isActive;
   }
   // 9) Save basic user info first
   await user.save();
   // 10) If accessRights is provided, update many-to-many
   if (accessRights !== undefined) {
     if (!Array.isArray(accessRights)) {
       return res.status(400).json({
         message: "accessRights must be an array of accessRight IDs",
       });
     }
     if (accessRights.length > 0) {
       const validRights = await AccessRight.findAll({
         where: { id: accessRights },
       });
       if (validRights.length !== accessRights.length) {
         return res.status(400).json({
           message: "One or more accessRight IDs are invalid",
           provided: accessRights,
           valid: validRights.map((r) => r.id),
         });
       }
       await user.setAccessRights(validRights.map((r) => r.id));
     } else {
       // If empty array sent → clear all rights
       await user.setAccessRights([]);
     }
   }
   // 11) Return updated user
   return res.status(200).json({
     message: "User updated successfully",
     user,
   });
 } catch (error) {
   console.error("Update User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/* ---------------------------------------------------------
  DELETE USER (DELETE /api/users/:id)
--------------------------------------------------------- */
export async function deleteUser(req, res) {
 try {
   const { id } = req.params;
   const user = await User.findByPk(id);
   if (!user) return res.status(404).json({ message: "User not found" });
   await user.setAccessRights([]); // clear join table
   await user.destroy();
   return res.status(200).json({ message: "User deleted successfully" });
 } catch (error) {
   console.error("Delete User Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/* ---------------------------------------------------------
  GET ALL USERS (GET /api/users)
--------------------------------------------------------- */
export async function getUsers(req, res) {
 try {
   const users = await User.findAll({
     include: [
       { model: AuthenticationType, as: "authType" },
       { model: Role, as: "role" },
       { model: Corporate, as: "corporate" },
       { model: AccessRight, as: "accessRights" },
     ],
     order: [["created_at", "DESC"]],
   });
   return res.status(200).json({ users });
 } catch (error) {
   console.error("Get Users Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}
/* ---------------------------------------------------------
  GET USER BY ID (GET /api/users/:id)
--------------------------------------------------------- */
export async function getUserById(req, res) {
 try {
   const { id } = req.params;
   const user = await User.findByPk(id, {
     include: [
       { model: AuthenticationType, as: "authType" },
       { model: Role, as: "role" },
       { model: Corporate, as: "corporate" },
       { model: AccessRight, as: "accessRights" },
     ],
   });
   if (!user) return res.status(404).json({ message: "User not found" });
   return res.status(200).json({ user });
 } catch (error) {
   console.error("Get User By ID Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}