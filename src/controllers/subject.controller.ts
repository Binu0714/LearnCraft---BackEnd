import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import { Subject } from "../models/Subject"

export const createSubject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { name, description, color } = req.body

        if (!name || !description || !color) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const newSubject = new Subject({
            name,
            description,
            color
        })

        await newSubject.save()

        res.status(201).json({
            message: "Subject created successfully",
            data: newSubject
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Fail to Save Post" })
    }
}