import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

import { router } from "./router";
import notFound from "./app/middlewares/notFound";// 
import './app/config/Passport';
import { envVars } from "./app/config/envVars";
import globalErrorHandler from "./app/middlewares/golobalError";

const app = express();


// Enable CORS with credentials
app.use(cors({
  origin: envVars.FRONT_END_URL, 
  //  origin: "http://localhost:5173", 
  credentials: true,      
}));

//  Body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

//  Session handling
app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "none", 
    maxAge: 1000 * 60 * 60 * 24, 
  },
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1", router);


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to IAR Wallet API 🚀" });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
