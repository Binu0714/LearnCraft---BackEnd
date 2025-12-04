import { Request, Response } from 'express';
import Schedule from '../models/Schedule';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from the request (Assuming you use auth middleware)
    // If you don't use middleware, use req.body.userId
    const userId = (req as any).user?.id || req.body.userId; 

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { date, slots } = req.body;

    // 2. Validation
    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Schedule slots are required" });
    }

    // 3. Create new Schedule
    const newSchedule = new Schedule({
      user: userId,
      date: date || new Date(),
      slots: slots
    });

    const savedSchedule = await newSchedule.save();

    res.status(201).json({ 
      success: true, 
      data: savedSchedule, 
      message: "Schedule saved successfully" 
    });

  } catch (error) {
    console.error("Save Schedule Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};