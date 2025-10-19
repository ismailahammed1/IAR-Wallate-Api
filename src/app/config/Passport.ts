/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

import { Agent, User } from "../modules/user/user.model";
import { envVars } from "./envVars";
import { isActive, Role, userStatus } from "../modules/user/user.interface";

function validateAccountStatus(user: any): string | null {
  if (!user.isVerified) return "User is not verified";
  if (user.isDeleted) return "User is deleted";
  if (
    user.isActive === isActive.BLOCKED ||
    user.isActive === isActive.INACTIVE
  ) {
    return `User is ${user.isActive}`;
  }
  return null;
}

// Localstrategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user =
          await User.findOne({ email })

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        const statusError = validateAccountStatus(user);
        if (statusError) {
          return done(null, false, { message: statusError });
        }

        const isGoogleAuthenticated =
          Array.isArray(user.auths) &&
          user.auths.some(
            (providerObj) => providerObj.provider === "google"
          );

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. Please login with Google and set a password first.",
          });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Password not set for this account.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password,
          user.password
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, user);

      } catch (error) {
        return done(error);
      }
    }
  )
);

//GooglStrategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
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
          return done(null, false, { message: "No email found" });
        }

        let user =
          (await User.findOne({ email })) ||
          (await Agent.findOne({ email }));

        if (user) {
          const statusError = validateAccountStatus(user);
          if (statusError) {
            return done(null, false, { message: statusError });
          }
        }

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: Role.USER,
             isVerified: true,
                     approved: true,
                     userStatus: userStatus.APPROVED,
            auths: [
              {
                provider: "google",
                providerID: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
      
        return done(error);
      }
    }
  )
);



passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user =
      (await User.findById(id)) ||
      (await Agent.findById(id));

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {

    done(error);
  }
});
