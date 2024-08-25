import { verifyToken } from '@/middleware/verifyToken';
import { TransactionController } from '../controllers/transaction.controller';
import { Router } from 'express';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/event',
      verifyToken,
      this.transactionController.addTransaction,
    );
    this.router.patch(
      '/pay',
      verifyToken,
      this.transactionController.payTransaction,
    );
    this.router.get('/event', this.transactionController.getTransaction);
    this.router.patch(
      '/point',
      verifyToken,
      this.transactionController.pointPrice,
    );
    this.router.patch(
      '/discount',
      verifyToken,
      this.transactionController.discountPrice,
    );
    this.router.get(
      '/history',
      verifyToken,
      this.transactionController.getHistoryTransaction,
    );
  }

  getRoute(): Router {
    return this.router;
  }
}
