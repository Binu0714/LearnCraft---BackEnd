import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export class PasswordController {

  // --- Request Password Reset ---
  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.json({ message: "If the account exists, reset email sent." });

      // Generate token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();

      // Reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <p>Hello ${user.username},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 15 minutes.</p>
        `
      });

      res.json({ message: "Reset email sent successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // --- Reset Password ---
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) return res.status(400).json({ message: "Invalid or expired token" });

      // Hash new password
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password reset successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}
