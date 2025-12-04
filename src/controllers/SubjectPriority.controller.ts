import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { SubjectPriority } from "../models/SubjectPriority"

export const setSubjectPriority = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { subjectId, priority } = req.body

        if (!subjectId || priority === undefined) {
            return res.status(400).json({ message: "Subject ID and priority are required" })
        }

        const existing = await SubjectPriority.findOne({ 
            userId: req.user._id, 
            subjectId 
        })

        if (existing) {
            existing.priority = priority
            await existing.save()

            return res.status(200).json({
                message: "Subject priority updated successfully",
                data: existing
            })
        }

        const newSubjectPriority = new SubjectPriority({
            userId: req.user._id,
            subjectId,
            priority
        })

        await newSubjectPriority.save()

        res.status(201).json({
            message: "Subject priority set successfully",
            data: newSubjectPriority
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to set subject priority" })
    }
}

export const getSubjectPriority = async (req: AuthRequest, res: Response) => {
    try{
        if(!req.user){
             return res.status(401).json({ message: "Unauthorized" })
        }

        const prorities = await SubjectPriority.find({
            userId: req.user._id
        })

        res.status(200).json({
            message: "Subject priorities retrieved successfully",
            data: prorities
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to retrieve subject priorities" })
    }
}