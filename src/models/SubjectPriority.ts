import mongoose from "mongoose";    

export interface ISubjectPriority extends mongoose.Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    subjectId: mongoose.Types.ObjectId
    priority: number
    createdAt: Date
    updatedAt: Date
}

const subjectPrioritySchema = new mongoose.Schema<ISubjectPriority>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    priority: { type: Number, required: true, min: 1, max: 5 }
}, {
    timestamps: true
})

export const SubjectPriority = mongoose.model<ISubjectPriority>("SubjectPriority", subjectPrioritySchema)