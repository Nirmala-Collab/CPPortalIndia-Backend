import db from "../models/index.js";
const { User, Role, Corporate, Company, AuthenticationType, AccessRight } = db;
export async function fetchUserById(userId) {
    if (!userId) return null;
    return User.findByPk(userId, {
        include: [
            { model: Role, as: "role" },
            { model: Corporate, as: "corporate" },
            { model: Company, as: "company" },
            { model: AuthenticationType, as: "authType" },
            { model: AccessRight, as: "accessRights" },
        ],
    });
}