import mongoose, { Document, Schema } from "mongoose"

export interface ISubject extends Document {
    _id: mongoose.Types.ObjectId
    name: string
    description: string
    color: string
    userId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const subjectSchema = new Schema<ISubject>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        color: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { 
        timestamps: true
    }
)

export const Subject = mongoose.model<ISubject>("Subject", subjectSchema)