import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    username: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false }
})

export const User = mongoose.model<IUser>("User", userSchema)