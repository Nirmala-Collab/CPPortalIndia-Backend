import express from "express";

import { getAccessRights } from "../controllers/accessRights.controller.js";
const router = express.Router();

router.get('/', getAccessRights)


export default router;