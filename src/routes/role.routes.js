import express from "express";

import { createRole,getRoleById,getRoles,updateRole,deleteRole } from "../controllers/role.controller";

const router = express.Router();

router.post('/',createRole)
router.get('/',getRoles)
router.post('/:id',updateRole)
router.get('/:id',getRoleById)
router.post('/:id',deleteRole)


export default router;