import { IUser } from "../models/User"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string
export const signAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: "30m"
    }
  )
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
export const signRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      sub: user._id.toString()
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  )
}
