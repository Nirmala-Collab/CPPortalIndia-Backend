import db from '../models/index.js';

const { User, Role, RoleAccessRight, UserAccessRight } = db;

const TEST_USER_EMAIL = 'AppHelpdesk.India@lockton.com';

export async function updateTestUserRole(req, res) {
  try {
    const roleNameInput = req.body.roleName;
    // RM / IT ADMIN
    if (!['RM', 'IT ADMIN'].includes(roleNameInput)) {
      return res.status(400).json({
        message: 'Invalid roleType. Allowed values: RM, IT ADMIN',
      });
    }

    // 🔒 Safety
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }

    // 1️⃣ Get test user
    const user = await User.findOne({
      where: { email: TEST_USER_EMAIL },
    });

    if (!user) {
      return res.status(404).json({ message: 'Test user not found' });
    }

    // 2️⃣ Get role (RM / IT ADMIN)
    const role = await Role.findOne({
      where: { roleName: roleNameInput },
    });

    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // 3️⃣ Get access rights by roleType (BUSINESS / IT)
    const roleAccessRights = await RoleAccessRight.findAll({
      where: { roleType: role.roleType },
      attributes: ['accessRightId'],
    });

    const accessRightIds = roleAccessRights.map((rar) => rar.accessRightId);

    //  Update user's roleId
    await user.update({
      roleId: role.id,
    });

    //  Remove old access rights
    await UserAccessRight.destroy({
      where: { user_id: user.id },
    });

    //  Assign new access rights
    const mappings = accessRightIds.map((accessRightId) => ({
      user_id: user.id,
      access_right_id: accessRightId,
    }));

    await UserAccessRight.bulkCreate(mappings);

    return res.status(200).json({
      message: `User switched to ${role.roleName}`,
      roleId: role.id,
      roleType: role.roleType,
      accessRightsCount: accessRightIds.length,
    });
  } catch (error) {
    console.error('Switch Role Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
