import { Router } from "express"
import { createSubject, getSubjects, deleteSubject, updateSubject } from "../controllers/subject.controller"
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

router.put(
    "/:id",
    authenticate,
    updateSubject
)


export default router