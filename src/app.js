// src/app.js
import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import cors from 'cors'
import { seedAuthenticationTypes } from "./seed/authenticationTypes.seed.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from './routes/user.routes.js'
import roleRoutes from './routes/role.routes.js'
import authTypeRoutes from './routes/authenticationType.routes.js'
import accessRightsRoutes from './routes/accessRights.routes.js'
import masterDataRoutes from './routes/masterData.routes.js'
import roleAccessRightsRoutes from './routes/roleAccessRight.routes.js'
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5003',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-type', 'Authorization'],
  credentials: true
}
));
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
app.use("/api/roles", roleRoutes);
app.use("/api/authType", authTypeRoutes);
app.use("/api/accessRights", accessRightsRoutes)
app.use('/api/masterDataSync', masterDataRoutes);
app.use('/api/roleAccessRights', roleAccessRightsRoutes)
export default app;