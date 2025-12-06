import { Router } from "express"
import {
    getMyDetails,
    handleRefreshToken,
    login,
    register,
    socialLoginSuccess,
    updateUser
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import passport from "passport";

const router = Router()

router.post(
    "/register", 
    register
);

router.post(
    "/refresh", 
    handleRefreshToken
);

router.post(
    "/login", 
    login
);

router.get(
    "/me", 
    authenticate, 
    getMyDetails
);

// google log in 
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  socialLoginSuccess 
);

// Facebook log in
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  socialLoginSuccess
);

router.put(
    "/:id",
    authenticate,
    updateUser
)

export default router