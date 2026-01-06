import db from "../models/index.js";
const { AuthenticationType } = db;


export async function getAuthenticationTypes(req, res) {
    try {
        const authTypes = await AuthenticationType.findAll();
        return res.status(200).json({ authTypes });
    } catch (err) {
        console.error("GetRoles Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}