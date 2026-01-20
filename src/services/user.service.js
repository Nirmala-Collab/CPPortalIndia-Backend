import db from "../models/index.js";
const { User, Role, Corporate, Company, AuthenticationType, AccessRight } = db;
export async function fetchUserById(userId) {
    if (!userId) return null;
    return User.findByPk(userId, {
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
}

export async function fetchUserByName(name) {
    if (!name) return null;
    return User.findOne({
        where: {
            fullName: name,
            isActive: true,
            deleted: false,
        },
        include: [
            { model: Role, as: "role" },
    
        ],
    });
}