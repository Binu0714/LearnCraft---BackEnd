import mongoose, { Document, Schema } from "mongoose"

export interface IRoutine extends Document {
    _id: mongoose.Types.ObjectId
    name: string
    startTime: string
    endTime: string
    userId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const routineSchema = new Schema<IRoutine>(
    {
        name: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { 
        timestamps: true
    }
)

export const Routine = mongoose.model<IRoutine>("Routine", routineSchema)