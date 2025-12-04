import express from "express";
import { createSchedule } from "../controllers/schedule.controller";

const router = express.Router();

router.post(
    "/", 
    createSchedule
);

export default router;
