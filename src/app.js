// src/app.js
import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import cors from 'cors'
import { seedAuthenticationTypes } from "./seed/authenticationTypes.seed.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from './routes/user.routes.js'
import roleRoutes from './routes/role.routes.js'
dotenv.config();
app.use(cors({
  origin:'http://localhost:5173',
  methods:['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders:['Content-type','Authorization'],
  credentials:true
}
));
const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
 res.json({ status: "OK" });
});
app.use("/auth", authRoutes);
// test DB connection & sync tables once at startup
(async () => {
 try {
   await db.sequelize.authenticate();
   console.log("✅ Database connection established");
   await db.sequelize.sync({ alter: true });
   console.log("✅ Models synchronized");
   await seedAuthenticationTypes();
 } catch (error) {
   console.error("❌ DB connection error:", error);
 }
})();

app.use("/api/users", userRoutes);
app.use("/api/roles",roleRoutes);
export default app;