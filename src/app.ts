import express, { Request, Response }  from "express"
import { router } from "./router";
import cors from 'cors'
import globalErrorHandler from "./app/middlewares/golobalError";


const app=express();
app.use(cors())
app.use(express.json());


app.use("/api/v1", router);

app.use("/",(req:Request,res:Response)=>{
    res.status(200).json({
  message: "Hello IAR Wallet"
});
})

// add this globalErrorHandler AFTER all routes
app.use(globalErrorHandler);


export default app