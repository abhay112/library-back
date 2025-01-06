import express, { Application } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import NodeCache from 'node-cache';
import Stripe from 'stripe';
import { config } from 'dotenv';
import { logger, stream } from './utils/logger.js';
import { Routes } from './interfaces/route.interface.js';
import { errorMiddleware } from './middlewares/error.js';
import swaggerDocument from './swagger.json';

config({ path: './.env' });

class App {
  public app: Application;
  public env: string;
  public port: string | number;
  public stripe: Stripe;
  public cache: NodeCache;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = process.env.NODE_ENV || 'development';
    this.port = process.env.PORT || 4000;
    this.stripe = new Stripe(process.env.STRIPE_KEY || '', { apiVersion: '2023-10-16' });
    this.cache = new NodeCache();

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`Swagger docs available at http://localhost:${this.port}/api-docs`);
      logger.info(`=================================`);
    });
  }

  public async closeDatabaseConnection(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error closing database connection:', error);
    }
  }

  public getServer(): Application {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      mongoose.set('strictQuery', false); // Optional: Controls how MongoDB interprets queries
      await mongoose.connect(process.env.MONGO_URI || '');
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
  

  private initializeMiddlewares() {
    this.app.use(morgan('dev', { stream }));
    this.app.use(cors({ origin: process.env.ORIGIN || '*', credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeSwagger() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
export const myCache = new NodeCache();
export default App;
