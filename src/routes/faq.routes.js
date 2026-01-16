import express from "express";
import { sendFaqEmail } from "../controllers/faq.controller.js";
const router = express.Router();
// Send direct email to RM

router.post("/sendFaqEmail", sendFaqEmail);
export default router;


