import { Request, Response } from 'express';
import Schedule from '../models/Schedule';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.body.userId; 

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { date, slots } = req.body;

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Schedule slots are required" });
    }

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


const calculateDuration = (timeRange: string): number => {
  if (!timeRange || typeof timeRange !== 'string') return 0;

  try {
    const parts = timeRange.split(" - ");
    if (parts.length !== 2) return 0;

    const [startStr, endStr] = parts;
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return 0;

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return (endMinutes - startMinutes) / 60;
  } catch (error) {
    return 0; 
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id || user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const schedules = await Schedule.find({ user: userId });

    let totalStudyHours = 0;
    const uniqueSubjects = new Set<string>();

    schedules.forEach((schedule) => {
      if (schedule.slots && Array.isArray(schedule.slots)) {
        schedule.slots.forEach((slot) => {
         
          if (slot.type === 'study') {
            const hours = calculateDuration(slot.time);
            totalStudyHours += hours;

            if (slot.activity) {
              uniqueSubjects.add(slot.activity);
            }
          }
        });
      }
    });

    totalStudyHours = Math.round(totalStudyHours * 10) / 10;

    res.status(200).json({
      success: true,
      totalHours: totalStudyHours,
      activeSubjects: uniqueSubjects.size
    });

  } catch (error) {
    console.error("Stats Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};