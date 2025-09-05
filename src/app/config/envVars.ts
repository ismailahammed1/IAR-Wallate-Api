import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGO_URL: string;
  NODE_ENV: "Development" | "Production";
  jwt_secret: string;
  jwt_Expired: string;
  JWT_REFRESH_SECRETS: string;
  JWT_REFRESH_EXPIRES: string;
  BCRYPT_SALT_ROUND: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWROD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONT_END_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requierdEnvVariables: string[] = [
    "PORT",
    "MONGO_URL",
    "NODE_ENV",
    "jwt_secret",
    "jwt_Expired",
    "JWT_REFRESH_SECRETS",
    "JWT_REFRESH_EXPIRES",
    "BCRYPT_SALT_ROUND",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWROD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONT_END_URL",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
  ];
  requierdEnvVariables.forEach((element) => {
    if (!process.env[element]) {
      throw new Error(`MIssing require enviroment ${element}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    MONGO_URL: process.env.MONGO_URL as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    jwt_secret: process.env.jwt_secret as string,
    jwt_Expired: process.env.jwt_Expired as string,
    JWT_REFRESH_SECRETS: process.env.JWT_REFRESH_SECRETS as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWROD: process.env.SUPER_ADMIN_PASSWROD as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONT_END_URL: process.env.FRONT_END_URL as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  };
};

export const envVars = loadEnvVariables();
