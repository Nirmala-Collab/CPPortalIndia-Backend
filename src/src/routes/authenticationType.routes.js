import express from "express";

import { getAuthenticationTypes } from "../controllers/authenticationType.controller.js";
const router = express.Router();

router.get('/', getAuthenticationTypes)


export default router;