import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
  StrategyOptionsWithRequest
} from "passport-google-oauth20";
import prisma from "./prisma";
import { Request } from "express";

//define types of config
const StrategyOptionsWithRequest = GoogleStrategy;
// Google OAuth configuration
const config: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLEClientId as string, 
  clientSecret: process.env.GOOGLEClientSecret as string, 
  callbackURL: `http://localhost:8800/api/auth/google/callback` as string, 
  passReqToCallback: true , // Explicitly include this property
};

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    config,
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Extract email from profile
        const email = profile.emails?.[0]?.value;
        if (!email) throw new Error("No email provided by Google");

        // Check if user already exists in the database
        let user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
          // Create a new user if not found
          user = await prisma.user.create({
            data: {
              fullname: profile.displayName || "Unknown User",
              email,
              username: `${email.split("@")[0]}${Math.random()
                .toString(36)
                .slice(2, 7)}`,
              gender: "other", // Google does not provide gender
              profileUrl: profile.photos?.[0]?.value || "", // Use profile picture if available
              authType: "google",
              password: "oauth2", // Placeholder for OAuth users
            },
          });
        }

        // Pass the user object to the next middleware
        done(null, user);
      } catch (error) {
        // Handle errors
        done(error as Error, false);
      }
    }
  )
);

// Optional: Session serialization (skip if using JWT)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error as Error, null);
  }
});

export default passport;
