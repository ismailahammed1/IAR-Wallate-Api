/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import app from './app';
import { envVars } from './app/config/envVars';
dotenv.config();

let server:Server;
;
const PORT = envVars.PORT || 3000;
const MONGO_URL = envVars.MONGO_URL || '';



const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

(async () => {
  await startServer();
})();


process.on('SIGTERM', (error) => {
  console.log('SIGTERM received...........Server shutting down', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('SIGINT', (error) => {
  console.log('SIGINT received...........Server shutting down', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection...........Server shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception...........Server shutting down', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

