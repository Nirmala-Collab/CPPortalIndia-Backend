import db from '../models/index.js';
const { RoleAccessRight, AccessRight } = db;
export async function getRoleAccessRights(req, res) {
  try {
    const rows = await RoleAccessRight.findAll({
      include: [
        {
          model: AccessRight,
          as: 'accessRight',
          attributes: ['id', 'rightName', 'code'],
        },
      ],
      order: [['roleType', 'ASC']],
    });
    // GROUP BY roleType
    const grouped = {};
    for (const row of rows) {
      const roleType = row.roleType;
      if (!grouped[roleType]) {
        grouped[roleType] = [];
      }
      grouped[roleType].push(row.accessRight.id);
    }
    return res.status(200).json(grouped);
  } catch (err) {
    console.error('Get Role Access Rights Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
