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
      '/add-transaction/:eventId',
      this.transactionController.addTransaction,
    );
    this.router.patch(
      '/pay-transaction/:ticketId',
      this.transactionController.payTransaction,
    );
  }

  getRoute(): Router {
    return this.router;
  }
}
