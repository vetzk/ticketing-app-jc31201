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
import { PORT } from './config';
// import { SampleRouter } from './routers/sample.router';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';
import { EventRouter } from './routers/event.router';
import { TransactionRouter } from './routers/transaction.router';
import path from 'path';

export default class App {
  readonly app: Express;

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
    this.app.use('/assets', express.static(path.join(__dirname, '../public')));
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
          console.error('Error : ', err.stack);
          console.log(err);

          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const profileRouter = new ProfileRouter();
    const eventRouter = new EventRouter();
    const transactionRouter = new TransactionRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/user', profileRouter.getRouter());
    this.app.use('/api/event', eventRouter.getRouter());
    this.app.use('/api/transaction', transactionRouter.getRoute());
    // this.app.use('/api/samples', sampleRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local: http://localhost:${PORT}/`);
    });
  }
}
