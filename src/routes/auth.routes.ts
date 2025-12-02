import { Router } from "express"
import {
    getMyDetails,
    handleRefreshToken,
    login,
    register
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/refresh", handleRefreshToken)
router.post("/login", login)

router.get("/me", authenticate, getMyDetails)



export default router