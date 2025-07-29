import express, { Request, Response }  from "express"


const app=express();

app.use("/",(req:Request,res:Response)=>{
    res.status(200).json({
        massage:"helleo IAR wallate"
    })
})

export default app