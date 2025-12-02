import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { Routine } from "../models/Routine"

export const createRoutine = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { name, startTime, endTime } = req.body

        if(!name || !startTime || !endTime){
            return res.status(400).json({message: "All fields are required"})
        }

        const routine = new Routine({
            name,
            startTime,
            endTime,
            userId: req.user._id
        })

        await routine.save()

        res.status(201).json({
            message: "Routine created successfully",
            data: routine
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

export const getRoutines = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const routines = await Routine.find({ userId: req.user._id })

        res.status(200).json({
            message: "Routines retrieved successfully",
            data: routines
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

export const deleteRoutine = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const routineId = req.params.id

        const deletedRoutine = await Routine.findOneAndDelete({ _id: routineId, userId: req.user._id })

        if (!deletedRoutine) {
            return res.status(404).json({ message: "Routine not found" })
        }

        res.status(200).json({
            message: "Routine deleted successfully",
            data: deletedRoutine
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to delete routine" })
    }
}