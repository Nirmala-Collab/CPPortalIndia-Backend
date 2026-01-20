import Company from "../models/company.model.js";

export async function getCompanies(req, res) {

    const { clientGroupId } = req.query;
    const where = {
        activeFlag: true,
        ...(clientGroupId ? { clientGroupId } : {}),

    };

    const companies = await Company.findAll({

        where,
        attributes: ["clientId", "name", "clientGroupId"],
        order: [["name", "ASC"]]
    })
    res.json(companies)
}