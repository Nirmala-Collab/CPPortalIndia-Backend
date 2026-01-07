import { syncMasterData } from "../services/masterSync.service.js";

export async function syncMasters(req, res) {
    try {

        const result = await syncMasterData();
        res.json({
            message: "Master data synced succesfully",
            result
        });

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Sync failed" });
    }
}