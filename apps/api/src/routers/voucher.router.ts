import { VoucherController } from '../controllers/voucher.controller';
import { verifyToken } from '../middleware/verifyToken';
import { Router } from 'express';

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/voucher', verifyToken, this.voucherController.getVoucher);
  }

  getRoute(): Router {
    return this.router;
  }
}
