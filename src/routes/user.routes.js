import express from "express";
import {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    getUsersByRoles
} from "../controllers/user.controller.js";
const router = express.Router();
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getUsers);
router.get("/user-by-role", getUsersByRoles);

router.get("/:id", getUserById);

export default router;