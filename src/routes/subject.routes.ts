import { Router } from "express"
import { createSubject, getSubjects, deleteSubject } from "../controllers/subject.controller"
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

router.delete(
    "/:id", 
    authenticate, 
    deleteSubject
)


export default router