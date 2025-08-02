/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
import { envVers } from "./env";
import { Role } from "../modules/user/user.interface";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // ✅ Your login form should send 'email'
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }

        const googleAuthenticated = isUserExist?.auth?.some(
          (providerObjects) => providerObjects.provider === "google"
        );
        if (!googleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
          });
        }

        const passwordMatched = await bcrypt.compare(
          password,
          isUserExist.password as string
        );

        if (!passwordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist); // success
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVers.GOOGLE_CLIENT_ID,
      clientSecret: envVers.GOOGLE_CLIENT_SECRET,
      callbackURL: envVers.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        const user = await User.findOne({ email });

        // 🔍 If no user with the email exists
        if (!user) {
          // ✅ Check if this is the very first user in the DB
          const totalUsers = await User.countDocuments();

          const newUser = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            isVerified: true,
            role: totalUsers === 0 ? Role.SuperAdmin : Role.Rider, // ✅ Conditionally assign role
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          return done(null, newUser);
        }

        // ✅ If user already exists, return that
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
