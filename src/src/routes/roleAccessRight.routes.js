import express from "express";

import { getRoleAccessRights } from "../controllers/roleAccessRights.controller.js";

const router = express.Router();

router.get('/', getRoleAccessRights)


export default router;