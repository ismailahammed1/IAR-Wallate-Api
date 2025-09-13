/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/envVars";
import path from "path";
import ejs from 'ejs';
import { AppError } from "../errorHelpers/AppError";
// Create transporter
const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  secure: true, // true for port 465, false for other ports
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },

});
interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}
// Send email function
export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, templateData);
  const info = await transporter.sendMail({
    from: `"IAR Wallet" <${envVars.SMTP_FROM}>`, // sender address
    to: to,
    subject: subject,
    html: html,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });


  return info;
  } catch (error: any) {
        throw new AppError(401, "Email error")
    }
};
