import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { TransactionController } from '../controllers/transaction.controller';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  public constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/transaction',
      this.transactionController.createTransaction,
    );
    this.router.get(
      '/transaction/:id',
      this.transactionController.readTransaction,
    );
    this.router.put(
      '/transaction/:id',
      this.transactionController.updateTransaction,
    );
    this.router.delete(
      '/transaction/:id',
      this.transactionController.deleteTransaction,
    );
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

  public getRouter(): Router {
    return this.router;
  }
}
