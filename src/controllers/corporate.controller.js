import Corporate from '../models/corporate.model.js';

export async function getCorporates(req, res) {
  const corporates = await Corporate.findAll({
    where: { activeFlag: true },
    attributes: ['clientGroupId', 'name'],
    order: [['name', 'ASC']],
  });

  res.json(corporates);
}
