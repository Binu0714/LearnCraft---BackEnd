import { Router } from "express"
import { createSubject, getSubjects } from "../controllers/subject.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post(
    "/",
    authenticate,
    createSubject
)

router.get(
    "/",
    authenticate,
    getSubjects
)

export default router