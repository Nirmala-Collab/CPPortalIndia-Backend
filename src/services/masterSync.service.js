import Corporate from "../models/corporate.model.js";

import Company from "../models/company.model.js";

import { fetchMastersData } from "./masterData.service.js";
import { generateAccessToken } from "./pasToken.service.js";

export async function syncCorporates(token) {

    const corporates = await fetchMastersData(token, "M13");

    for (const item of corporates) {
        await Corporate.upsert({
            clientGroupId: item.client_group_id,
            name: item.name,
            activeFlag: item.active_flag === "1"
        })
    }

    return corporates;
}

export async function syncCompanies(token) {

    const companies = await fetchMastersData(token, "M14");

    for (const item of companies) {
        // 🔒 Check if corporate exists
        const corporateExists = await Corporate.findByPk(
            item.client_group_id
        );
        if (!corporateExists || corporateExists.length == 0) {
            console.warn(
                `Skipping company ${item.Client_id} — corporate ${item.client_group_id} not found`
            );
            continue;
        }
        await Company.upsert({
            clientId: item.Client_id,
            name: item.name,
            clientGroupId: item.client_group_id,
            activeFlag: item.active_flag === "1",
        });
    }
    return companies;
}


export async function syncMasterData() {

    const token = await generateAccessToken();

    console.log('token', token)

    const corporates = await syncCorporates(token);
    const companies = await syncCompanies(token);

    return {
        corporates: corporates.length,
        companies: companies.length
    }

}