import db from "../models/index.js";
const { AccessRight } = db;


export async function getAccessRights(req, res) {
    try {
        const accessRights = await AccessRight.findAll();
        return res.status(200).json({ accessRights });
    } catch (err) {
        console.error("Get Access Rights Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
