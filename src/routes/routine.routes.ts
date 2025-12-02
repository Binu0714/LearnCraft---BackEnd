import { Router } from "express"
import { createRoutine, getRoutines, deleteRoutine } from "../controllers/routine.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post(
    "/",
    authenticate,
    createRoutine
)

router.get(
    "/",
    authenticate,
    getRoutines
)

router.delete(
    "/:id",
    authenticate,
    deleteRoutine
)

export default router