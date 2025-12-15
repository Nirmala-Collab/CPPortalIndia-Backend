// src/services/jwt.service.js
import jwt from "jsonwebtoken";
export function generateJwtToken(payload) {
 return jwt.sign(payload, process.env.JWT_SECRET, {
   expiresIn: process.env.JWT_EXPIRES_IN || "1h",
 });
}