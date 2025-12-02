import { Router } from "express"
import { createSubject } from "../controllers/subject.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post(
    "/",
    authenticate,
    createSubject
)

export default router