import express from "express";
import { contactRm } from "../controllers/faq.controller.js";
const router = express.Router();
// Send direct email to RM

router.post("/contact-rm", contactRm);
export default router;


