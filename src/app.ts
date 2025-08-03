import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { router } from "./router"; 
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/golobalError";
import passport from "passport";
import expressSession from 'express-session'
import './app/config/Passport';
import { envVars } from "./app/config/envVars";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(expressSession(
  {
      secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  }
))
app.use(passport.initialize())
app.use(passport.session())


app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to IAR Wallet API" });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
