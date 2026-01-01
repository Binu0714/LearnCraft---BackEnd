import express from "express";
import { createSchedule, getDashboardStats } from "../controllers/schedule.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post(
    "/", 
    authenticate,
    createSchedule
);

router.get(
    "/", 
    authenticate,
    getDashboardStats
);

export default router;
