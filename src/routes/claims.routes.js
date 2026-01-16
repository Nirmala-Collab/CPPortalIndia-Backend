import express from "express";
import {
    requestRmCallback,
    uploadClaimDocument,
} from "../controllers/claim.controller.js";
import upload from "../middlewares/upload.middleware.js";
const router = express.Router();
// RM callback request
router.post("/:claimId/rm-callback", requestRmCallback);
// Upload claim document
router.post(
    "/:claimId/documents/upload",
    upload.single("file"),
    uploadClaimDocument
);
export default router;