import dotenv from 'dotenv';
dotenv.config();

import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import eventRoutes from '@/routers/event.router';
import { PORT } from './config'; // Assuming PORT is defined in your config

export default class App {
  private app: Express;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use('/events', eventRoutes);
    
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    // Initialize other routes if necessary
    // Example: const sampleRouter = new SampleRouter();
    // this.app.use('/api/samples', sampleRouter.getRouter());
  }

  private handleError(): void {
    // Handle 404 errors
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found!');
      } else {
        next();
      }
    });

    // Handle 500 errors
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error:', err.stack);
          res.status(500).send('Internal server error!');
        } else {
          next();
        }
      },
    );
  }


  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local: http://localhost:${PORT}/`);
    });
  }
}

