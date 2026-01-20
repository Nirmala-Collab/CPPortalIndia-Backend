import db from "../models/index.js";
import { Op } from "sequelize";
import { fetchUserById,fetchUserByName } from "../services/user.service.js";
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
      clientGroupId,
      clientIds,
      relationshipManager,
      claimsManager,
      endDate,
      assignCorporateGroup,
      authTypeId,
      accessRights,
      isActive,
      deleted = false,
    } = req.body;
    /* -------------------- BASIC REQUIRED VALIDATION -------------------- */
    if (
      !fullName ||
      !email ||
      !phone ||
      !roleId ||
      !endDate ||
      !authTypeId ||
      isActive === undefined ||
      deleted === undefined
    ) {
      return res.status(400).json({
        message: "Please fill the mandatory fields for creating a user",
      });
    }
    const reAssignGroupId = clientGroupId ? clientGroupId : null
    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      return res.status(400).json({
        message: "At least one access right must be selected",
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
    const emailDomain = emailLower.split("@")[1];
    if (!emailDomain) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const internalDomains = [
      "lockton.com",
    ];
    const allowedExternalTlds = [".com"];
    let userType = "EXTERNAL";
    if (internalDomains.includes(emailDomain)) {
      userType = "INTERNAL";
    } else {
      const validExternal = allowedExternalTlds.some((tld) =>
        emailDomain.endsWith(tld)
      );
      if (userType === "EXTERNAL") {
        if (!relationshipManager || !claimsManager) {
          return res.status(400).json({
            message: "RM & CM required for external user",
          });
        }
      }
      if (!validExternal) {
        return res.status(400).json({
          message:
            "Invalid corporate email domain. Only .com allowed",
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
      clientGroupId: reAssignGroupId,
      assignCorporateGroup,
      relationshipManager,
      claimsManager,
      endDate,
      isActive,
      deleted,
      authTypeId,
    });
    /* -------------------- ASSIGN ACCESS RIGHTS -------------------- */
    await user.setAccessRights(accessRights);
    await user.setCompanies(clientIds);
    return res.status(201).json({
      message: "User created successfully",
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
    const userId = req.params.id;
    const {
      fullName,
      phone,
      roleId,
      clientGroupId,
      clientId,
      relationshipManager,
      claimsManager,
      assignCorporateGroup,
      endDate,
      authTypeId,
      accessRights,
      isActive,
      deleted = false,
    } = req.body;
    // Mandatory validation
    if (
      !fullName ||
      !phone ||
      !roleId ||
      !relationshipManager ||
      !claimsManager ||
      !assignCorporateGroup ||
      !endDate ||
      !authTypeId ||
      isActive === undefined ||
      deleted === undefined
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
    // Update user
    await user.update({
      fullName,
      phone,
      roleId,
      clientGroupId,
      clientId,
      relationshipManager,
      claimsManager,
      assignCorporateGroup,
      endDate,
      isActive,
      deleted,
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
      where: {
        isActive: true,
        deleted: false,
      },
      include: [
        { model: Role, as: "role" },
        { model: Corporate, as: "corporate" },
        { model: Company, as: "companies" },
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
    const { id } = req.params;
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function getUserByName(req, res) {
  try {
    const { name } = req.params;
    const user = await fetchUserByName(name);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getUsersByRoles(req, res) {
  try {
    const { roles } = req.query;
    if (!roles) {
      return res.status(400).json({
        message: "roles query param is required (e.g. roles=RM,CM)",
      });
    }
    // RM,CM → ["RM", "CM"]
    const roleList = roles
      .split(",")
      .map(r => r.trim().toUpperCase());
    const users = await User.findAll({
      attributes: ["fullName"],
      include: [
        {
          model: Role,
          as: "role",
          required: true,
          where: {
            roleName: {
              [Op.in]: roleList,
            },
          },
          attributes: ["roleName"],
        },
      ],
    });
    const grouped = {};
    roleList.forEach(role => {
      grouped[role] = [];
    });
    users.forEach(user => {
      const roleName = user.role.roleName;
      grouped[roleName].push(user.fullName);
    });
    return res.status(200).json(grouped);
  } catch (error) {
    console.error("Get Users By Roles Error:", error);
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
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ deleted: true });
    return res.status(200).json({
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}