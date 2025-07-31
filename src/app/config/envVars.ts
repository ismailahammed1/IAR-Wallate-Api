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
  SUPER_ADMIN_EMAIL:string;
  SUPER_ADMIN_PASSWROD:string;
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
  };
};

export const envVars = loadEnvVariables();
