 import nodemailer from 'nodemailer'
import { envVars } from '../config/envVars';
 
 const transporter = nodemailer.createTransport({
    
     secure:true,
     auth:{
        user:envVars.SMTP_USER,
        pass:envVars.SMTP_PASS,
     }
    host:envVars.SMTP_HOST,
     port:Number(envVars.SMTP_PORT),
  });