import { sendEmail } from "../services/email.service.js";
export async function sendFaqEmail(req, res) {
    const { message, rmEmail } = req.body;
    await sendEmail({
        to: rmEmail,
        subject: "FAQ - Client Message",
        html: message
    });
    res.json({ message: "Email sent successfully" });
}
