import express from "express";
import { authenticate } from "../middleware/auth";
import { setSubjectPriority, getSubjectPriority } from "../controllers/SubjectPriority.controller";

const router = express.Router();

router.post(
    "/",
    authenticate,
    setSubjectPriority
)

router.get(
    "/",
    authenticate,
    getSubjectPriority
)

export default router;