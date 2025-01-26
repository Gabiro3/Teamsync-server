import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "../src/config/app.config";
import connectDatabase from "../src/config/database.config";
import { errorHandler } from "../src/middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "../src/config/http.config";
import { asyncHandler } from "../src/middlewares/asyncHandler.middleware";
import { BadRequestException } from "../src/utils/appError";
import { ErrorCodeEnum } from "../src/enums/error-code.enum";
import passport from "passport";
import authRoutes from "../src/routes/auth.route";
import userRoutes from "../src/routes/user.route";
import isAuthenticated from "../src/middlewares/isAuthenticated.middleware";
import workspaceRoutes from "../src/routes/workspace.route";
import memberRoutes from "../src/routes/member.route";
import projectRoutes from "../src/routes/project.route";
import taskRoutes from "../src/routes/task.route";
import reportRoutes from "../src/routes/report.route";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../src/services/auth.service";

const app = express();
const BASE_PATH = config.BASE_PATH;

// CORS Configuration
const allowedOrigins = [
  'https://teamsync-frontend-chi.vercel.app',
  // Add other origins here if necessary
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

// Add Passport Google Strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Your user lookup/creation logic here
        // This should match your existing Google strategy implementation
        return done(null, profile);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        console.log(user);
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

// Add these passport serialization methods
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

app.use(passport.initialize());
app.use(passport.session());

// Update CORS middleware to allow only specific origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/reports`, isAuthenticated, reportRoutes);

app.use(errorHandler);

// The serverless function handler for Vercel
export default (req: Request, res: Response) => {
  app(req, res);
};


