import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGO_URL: string;
  NODE_ENV: "Development"| "Production";
}

const loadEnvVariables = (): EnvConfig => {
    const requierdEnvVariables:string[]=["PORT","MONGO_URL","NODE_ENV"]
    requierdEnvVariables.forEach(element => {
        if (!process.env[element]) {
            throw new Error(`MIssing require enviroment ${element}`)
        }
    });
  return {
    PORT: process.env.PORT as string,
    MONGO_URL: process.env.MONGO_URL as string,
    NODE_ENV: process.env.NODE_ENV as  "Development"| "Production",
  };
};

export const envVars = loadEnvVariables();
