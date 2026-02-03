import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import db from '../models/index.js';
import { sendEmail } from '../services/email.service.js';
import { userCreated } from '../utils/mailContent.js';
import { fetchUserById, fetchUserByName } from '../services/user.service.js';
const { User, Role, Corporate, Company, AuthenticationType, AccessRight } = db;
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
      !authTypeId ||
      isActive === undefined ||
      deleted === undefined
    ) {
      return res.status(400).json({
        message: 'Please fill the mandatory fields for creating a user',
        fullName,
        email,
        phone,
        roleId,
        authTypeId,
      });
    }
    let reAssignGroupId = '50';
    let ReAssignCorporateGroup;
    if (!Array.isArray(accessRights) || accessRights.length === 0) {
      return res.status(400).json({
        message: 'At least one access right must be selected',
      });
    }
    if (assignCorporateGroup === 'NA' || !assignCorporateGroup) {
      ReAssignCorporateGroup = null;
    }
    /* -------------------- EMAIL VALIDATION -------------------- */
    const emailLower = email.toLowerCase();
    const emailDomain = emailLower.split('@')[1];
    if (!emailDomain) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const internalDomains = ['lockton.com'];
    const allowedExternalTlds = ['.com'];
    let userType = 'EXTERNAL';
    if (internalDomains.includes(emailDomain)) {
      userType = 'INTERNAL';
    } else {
      const validExternal = allowedExternalTlds.some((tld) => emailDomain.endsWith(tld));
      if (userType === 'EXTERNAL') {
        if (!relationshipManager || !claimsManager) {
          return res.status(400).json({
            message: 'RM & CM required for external user',
          });
        }
        reAssignGroupId = clientGroupId ? clientGroupId : null;
        if (!Array.isArray(clientIds) || clientIds.length === 0) {
          return res.status(400).json({
            message: 'At least one company must be selected',
          });
        }
      }
      if (!validExternal) {
        return res.status(400).json({
          message: 'Invalid corporate email domain. Only .com allowed',
        });
      }
    }
    /* -------------------- DUPLICATE CHECKS -------------------- */
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    /* -------------------- CREATE USER -------------------- */
    const user = await User.create({
      fullName,
      email,
      phone,
      userType,
      roleId,
      clientGroupId: reAssignGroupId,
      assignCorporateGroup: ReAssignCorporateGroup,
      relationshipManager,
      claimsManager,
      endDate: endDate || null,
      isActive,
      deleted,
      authTypeId,
    });
    /* -------------------- ASSIGN ACCESS RIGHTS -------------------- */
    await user.setAccessRights(accessRights);
    await user.setCompanies(clientIds);
    const toEmail = email.toLowerCase();
    if (toEmail) {
      sendEmail({
        to: toEmail,
        subject: userCreated.subject,
        html: userCreated.body({
          fullName,
          username: toEmail,
          portalUrl: process.env.PORTAL_URL,
          supportEmail: process.env.SUPPORT_EMAIL,
        }),
      })
        .then(() => console.log(`User created email sent to ${toEmail}`))
        .catch((err) => console.warn('Failed to send user created email:', err?.message || err));
    }
    return res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create User Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
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
      email,
      phone,
      roleId,
      clientGroupId,
      clientIds,
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
      !authTypeId ||
      isActive === undefined ||
      deleted === undefined
    ) {
      return res.status(400).json({
        message: 'All fields are mandatory for update',
      });
    }

    console.log('Client GroupId......:', req.body, phone);
    if (!Array.isArray(accessRights) || accessRights.length === 0) {
      return res.status(400).json({
        message: 'At least one access right must be selected',
      });
    }
    let ReAssignCorporateGroup;
    if (assignCorporateGroup === 'NA' || !assignCorporateGroup) {
      ReAssignCorporateGroup = null;
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (email !== user.email) {
      return res.status(400).json({ message: 'Email cannot be changed' });
    }
    let reAssignGroupId;
    if (user.userType === 'EXTERNAL') {
      if (!relationshipManager || !claimsManager) {
        return res.status(400).json({
          message: 'RM & CM required for external user',
        });
      }
      reAssignGroupId = clientGroupId ? clientGroupId : null;
      if (!Array.isArray(clientIds) || clientIds.length === 0) {
        return res.status(400).json({
          message: 'At least one company must be selected',
        });
      }
    }
    if (user.userType === 'INTERNAL') {
      reAssignGroupId = clientGroupId;
    }
    // Update user
    await user.update({
      fullName,
      phone,
      email,
      roleId,
      clientGroupId: reAssignGroupId,
      clientIds,
      relationshipManager,
      claimsManager,
      assignCorporateGroup: ReAssignCorporateGroup,
      endDate: endDate || null,
      isActive,
      deleted,
      authTypeId,
    });
    // Update access rights
    await user.setAccessRights(accessRights);
    await user.setCompanies(clientIds);
    return res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
/**
 * ----------------------------------------------------
 * GET ALL USERS (RETURN EVERYTHING)
 * ----------------------------------------------------
 */

export async function getUsers(req, res) {
  try {
    // console.log('params', req.params);
    // const { loggedInUserId } = req.body; // or req.query

    const users = await User.findAll({
      where: {
        isActive: true,
        deleted: false,
        // ...(loggedInUserId && {
        //   id: { [Op.ne]: loggedInUserId },
        // }),
      },
      include: [
        { model: Role, as: 'role' },
        { model: Corporate, as: 'corporate' },
        { model: Company, as: 'companies' },
        { model: AuthenticationType, as: 'authType' },
        { model: AccessRight, as: 'accessRights' },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get User Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export async function getUserByName(req, res) {
  try {
    const { name } = req.params;
    const user = await fetchUserByName(name);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get User By Name Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getUsersByType(req, res) {
  try {
    const { usertype } = req.params;
    if (!usertype) {
      return res.status(400).json({
        message: 'usertype param is required (internal|external)',
      });
    }
    const type = usertype.toString().trim().toUpperCase();
    if (!['INTERNAL', 'EXTERNAL'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid usertype. Allowed values: internal, external',
      });
    }

    const users = await User.findAll({
      where: {
        userType: type,
        isActive: true,
        deleted: false,
      },
      attributes: ['fullName'],
      order: [['fullName', 'ASC']],
    });

    const names = users.map((u) => u.fullName);
    return res.status(200).json(names);
  } catch (error) {
    console.error('Get Users By Type Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getUsersByRoles(req, res) {
  try {
    const { roles } = req.query;
    if (!roles) {
      return res.status(400).json({
        message: 'roles query param is required (e.g. roles=RM,CM)',
      });
    }
    const roleList = roles.split(',').map((r) => r.trim().toUpperCase());
    const users = await User.findAll({
      attributes: ['fullName'],
      include: [
        {
          model: Role,
          as: 'role',
          required: true,
          where: {
            roleName: {
              [Op.in]: roleList,
            },
          },
          attributes: ['roleName'],
        },
      ],
    });
    const grouped = {};
    roleList.forEach((role) => {
      grouped[role] = [];
    });
    users.forEach((user) => {
      const roleName = user.role.roleName;
      grouped[roleName].push(user.fullName);
    });
    return res.status(200).json(grouped);
  } catch (error) {
    console.error('Get Users By Roles Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function uploadProfilePhoto(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'No file uploaded. Use form field name "profilePhoto".' });
    }

    // delete previous file if stored on disk
    if (user.profilePhoto) {
      try {
        const prevRelative = user.profilePhoto.replace(/^\//, ''); // remove leading slash
        const prevPath = path.join(process.cwd(), prevRelative);
        if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
      } catch (err) {
        console.warn('Failed to delete previous profile photo:', err.message);
      }
    }

    const photoPath = `/uploads/profile-photos/${req.file.filename}`;

    await user.update({ profilePhoto: photoPath });

    return res.status(200).json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: photoPath,
    });
  } catch (error) {
    console.error('Profile Photo Upload Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ deleted: true });
    return res.status(200).json({
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
