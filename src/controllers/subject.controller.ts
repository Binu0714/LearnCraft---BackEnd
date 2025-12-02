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
            color,
            userId: req.user._id
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

export const getSubjects = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const subjects = await Subject.find({ userId: req.user._id })

        res.status(200).json({
            message: "Subjects retrieved successfully",
            data: subjects
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Fail to Retrieve Subjects" })
    }
}

export const deleteSubject = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const subjectId = req.params.id

        const deletedSubject = await Subject.findOneAndDelete({ _id: subjectId, userId: req.user._id })

        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" })
        }

        res.status(200).json({
            message: "Subject deleted successfully",
            data: deletedSubject
        })

    }catch (error) {
        console.error(error)
        res.status(500).json({ message: "Fail to Delete Subject" })
    }
}

export const updateSubject = async (req: AuthRequest, res: Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const subjectId = req.params.id
        const { name, description, color } = req.body
        
        const updatedSubject = await Subject.findByIdAndUpdate(
            { _id: subjectId, userId: req.user.id },
            { name, description, color },
            { new: true }
        )

        if (!updatedSubject) {
            return res.status(404).json({ message: "Subject not found" })
        }

        res.status(200).json({
            message: "Subject updated successfully",
            data: updatedSubject
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Fail to Update Subject" })
    }
}