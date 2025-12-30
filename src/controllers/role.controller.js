import { Role } from "../models/index.js";
//
// CREATE ROLE
//
export async function createRole(req, res) {
 try {
   const { roleType, roleName, description } = req.body;
   if (!roleType || !roleName) {
     return res.status(400).json({ message: "roleType and roleName are required" });
   }
   // Check duplicate by roleName + roleType
   const existing = await Role.findOne({ where: { roleType, roleName } });
   if (existing) {
     return res.status(400).json({ message: "Role already exists with same type & name" });
   }
   const role = await Role.create({ roleType, roleName, description });
   return res.status(201).json({
     message: "Role created successfully",
     role,
   });
 } catch (err) {
   console.error("CreateRole Error:", err);
   return res.status(500).json({ message: "Internal server error" });
 }
}
//
// GET ALL ROLES
//
export async function getRoles(req, res) {
 try {
   const roles = await Role.findAll();
   return res.status(200).json({ roles });
 } catch (err) {
   console.error("GetRoles Error:", err);
   return res.status(500).json({ message: "Internal server error" });
 }
}
//
// GET ROLE BY ID
//
export async function getRoleById(req, res) {
 try {
   const { id } = req.params;
   const role = await Role.findByPk(id);
   if (!role) {
     return res.status(404).json({ message: "Role not found" });
   }
   return res.status(200).json({ role });
 } catch (err) {
   console.error("GetRoleById Error:", err);
   return res.status(500).json({ message: "Internal server error" });
 }
}
//
// UPDATE ROLE
//
export async function updateRole(req, res) {
 try {
   const { id } = req.params;
   const { roleType, roleName, description } = req.body;
   const role = await Role.findByPk(id);
   if (!role) {
     return res.status(404).json({ message: "Role not found" });
   }
   await role.update({ roleType, roleName, description });
   return res.status(200).json({
     message: "Role updated successfully",
     role,
   });
 } catch (err) {
   console.error("UpdateRole Error:", err);
   return res.status(500).json({ message: "Internal server error" });
 }
}
//
// DELETE ROLE
//
export async function deleteRole(req, res) {
 try {
   const { id } = req.params;
   const role = await Role.findByPk(id);
   if (!role) {
     return res.status(404).json({ message: "Role not found" });
   }
   await role.destroy();
   return res.status(200).json({ message: "Role deleted successfully" });
 } catch (err) {
   console.error("DeleteRole Error:", err);
   return res.status(500).json({ message: "Internal server error" });
 }
}