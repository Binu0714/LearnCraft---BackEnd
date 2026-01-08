import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export class PasswordController {
 
  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ message: "If the account exists, reset email sent." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: '"Study App" <no-reply@studyapp.com>',
        to: user.email,
        subject: "Password Reset Instructions",
        html: `
          <p>Hello ${user.username},</p>
          <p>We received a request to reset your password for your Study App account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align:center;">
            <a href="${resetLink}" style="
              display:inline-block;
              padding:10px 20px;
              font-size:16px;
              color:white;
              background-color:#4CAF50;
              text-decoration:none;
              border-radius:5px;
            ">Reset Password</a>
          </p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>This link will expire in 15 minutes.</p>
          <p>Thank you,<br/>Study App Team</p>
        `,
        text: `Hello ${user.username},

        We received a request to reset your password for your Study App account.

        Copy and paste this link in your browser to reset your password:
        ${resetLink}

        If you did not request a password reset, please ignore this message.

        This link will expire in 15 minutes.

        Thank you,
        Study App Team
        `,
      });

      return res.json({ message: "Reset email sent successfully" });
    } catch (err) {
      console.error("Password reset error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!user)
        return res.status(400).json({ message: "Invalid or expired token" });

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
