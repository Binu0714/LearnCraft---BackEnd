import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models/User"; // Import your User model
import crypto from "crypto";

// --- GOOGLE STRATEGY ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists by email
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          return done(null, user);
        }

        // 2. If not, create a new user
        // Note: Password is empty or generated random string because they login via Google
        user = new User({
          username: profile.displayName,
          email: profile.emails?.[0].value,
          password: "", // Ensure your User model allows empty password or handle this
          roles: ["USER"],
          // Optional: avatar: profile.photos?.[0].value
        });

        await user.save();
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

// --- FACEBOOK STRATEGY ---
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: "http://localhost:5000/api/v1/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"], // Request emails & photos
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found from Facebook"), undefined);
        }

        let user = await User.findOne({ email });
        if (user) return done(null, user);

        // Create new user with random password
        user = new User({
          username: profile.displayName || "FacebookUser",
          email,
          password: crypto.randomBytes(16).toString("hex"),
          roles: ["USER"],
          avatar: profile.photos?.[0]?.value,
        });

        await user.save();
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

export default passport;