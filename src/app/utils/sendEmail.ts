
import nodemailer from 'nodemailer';
import { envVars } from '../config/envVars';
import { AppError } from '../errorHelpers/AppError';

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string; // Pass HTML directly
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"IAR Wallet" <${envVars.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new AppError(500, 'Email sending failed');
  }
};