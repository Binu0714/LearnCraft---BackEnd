import { Router } from "express"
import {
  handleRefreshToken,
  register
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/refresh", handleRefreshToken)

export default router