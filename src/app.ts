import express, { Application } from "express";
import cors from "cors";
import { router } from "./router"; 
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/golobalError";

const app: Application = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1", router);

// Default welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to IAR Wallet API" });
});

// 404 Not Found handler
app.use(notFound);

// Global error handler (should be last)
app.use(globalErrorHandler);

export default app;
