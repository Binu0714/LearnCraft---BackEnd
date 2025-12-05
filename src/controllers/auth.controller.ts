import { Request, Response } from "express"
import { IUser, User } from "../models/User"
import bcrypt from "bcryptjs"
import { signAccessToken , signRefreshToken } from "../utils/tokens"
import { AuthRequest } from "../middleware/auth"
import  Jwt  from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const register = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return  res.status(400).json({message: "All fields are required"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })
    } catch (err: any) {
        res.status(500).json({message: "Internal server error"})
    }
}   

export const handleRefreshToken = async (req: Request, res: Response) => {

  try {
    const  { token }  = req.body

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const payload = Jwt.verify(token, JWT_REFRESH_SECRET)
    const user = await User.findById(payload.sub)

    if (!user) {
      return res.status(403).json({ message: "Invalid expire token" })
    }

    const accessToken = signAccessToken(user)

    res.status(200).json({ accessToken })

  } catch (error) {
    res.status(500).json({ message: "Invalid or expire token" })
  }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({message: "User not found"})
        }

        const valid = await bcrypt.compare(password, existingUser.password)
        if(!valid){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "Login successful",
            data: {
                email: existingUser.email,
                accessToken,
                refreshToken
            }
        })
    } catch (err: any) {
        res.status(500).json({message: "Internal server error"})
    }
}

export const getMyDetails = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.sub

    const user = ((await User.findById(userId).select("-password")) as IUser) || null

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const { _id, username, email } = user

    res.status(200).json({
        message: "User details fetched successfully",
        data: {
            id: _id,
            username,
            email
        }
    })
}

export const socialLoginSuccess = async (req: Request, res: Response) => {
  try {
    const user = req.user as any; // Passport attaches the user to req

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }

    // Generate tokens using your existing utility
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Redirect to Frontend with tokens in URL
    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    console.error("Social Login Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};