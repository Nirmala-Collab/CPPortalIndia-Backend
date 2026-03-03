import db from '../models/index.js';
const { User, Role, Corporate, Company, AuthenticationType, AccessRight } = db;
// services/user.service.js
export async function fetchUserById(userId) {
  if (!userId) return null;

  const user = await User.findOne({
    where: { id: userId, isActive: true, deleted: false },
    attributes: [
      'id', 'fullName', 'firstName', 'lastName', 'email', 'mobile',
      'userType', 'isActive', 'policyAccepted',
      'relationship_manager', 'claims_manager' // keep if you need them
    ],
    include: [
      { model: Role, as: 'role', attributes: ['id', 'roleName', 'roleType'] },
      { model: Corporate, as: 'corporate', attributes: ['id', 'name'] },
      { model: Company, as: 'companies', attributes: ['id', 'name'] },
      { model: AuthenticationType, as: 'authType', attributes: ['id', 'name'] },
      { model: AccessRight, as: 'accessRights', attributes: ['id', 'rightName', 'code'] },

      {
        model: User,
        as: 'relationshipManager',
        attributes: ['id', 'fullName', 'email'],
      },
      {
        model: User,
        as: 'claimsManager',
        attributes: ['id', 'fullName', 'email'],
      },
    ],
    order: [['fullName', 'ASC']],
  });

  if (!user) return null;

  // Return a clean, stable shape (no Sequelize instance leakage)
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    userType: user.userType,
    isActive: user.isActive,
    policyAccepted: user.policyAccepted,

    role: user.role
      ? { id: user.role.id, roleName: user.role.roleName, roleType: user.role.roleType }
      : null,

    corporate: user.corporate
      ? { id: user.corporate.id, name: user.corporate.name }
      : null,

    companies: (user.companies || []).map(c => ({ id: c.id, name: c.name })),

    authType: user.authType
      ? { id: user.authType.id, name: user.authType.name }
      : null,

    accessRights: (user.accessRights || []).map(r => ({
      id: r.id, rightName: r.rightName, code: r.code,
    })),

    relationshipManager: user.relationshipManager
      ? {
        id: user.relationshipManager.id,
        fullName: user.relationshipManager.fullName,
        email: user.relationshipManager.email,
      }
      : null,

    claimsManager: user.claimsManager
      ? {
        id: user.claimsManager.id,
        fullName: user.claimsManager.fullName,
        email: user.claimsManager.email,
      }
      : null,
  };
}

export async function fetchUserByName(name) {
  if (!name) {
    return null;
  }
  return User.findOne({
    where: {
      fullName: name,
      isActive: true,
      deleted: false,
    },
    include: [{ model: Role, as: 'role' }],
    order: [['fullName', 'ASC']],
  });
}
