import express from "express";

import { createRole,getRoleById,getRoles,updateRole,deleteRole } from "../controllers/role.controller.js";

const router = express.Router();

router.post('/',createRole)
router.get('/',getRoles)
router.patch('/:id',updateRole)
router.get('/:id',getRoleById)
router.delete('/:id',deleteRole)


export default router;