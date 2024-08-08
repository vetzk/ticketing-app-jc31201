import { AuthController } from '@/controllers/auth.controller';
import { forgotPassValidation } from '@/middleware/validator/forgotPassword';
import { loginValidation } from '@/middleware/validator/login';
import { registerValidation } from '@/middleware/validator/register';
import { resetPassValidation } from '@/middleware/validator/resetPassword';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/login',
      loginValidation,
      limiter,
      this.authController.login,
    );
    this.router.post('/keeplogin', verifyToken, this.authController.keepLogin);
    this.router.post(
      '/forgot-password',
      forgotPassValidation,
      this.authController.forgotPassword,
    );
    this.router.patch(
      '/reset-password',
      resetPassValidation,
      verifyToken,
      this.authController.resetPassword,
    );
    this.router.post(
      '/register',
      registerValidation,
      this.authController.register,
    );
    this.router.post('/logout', this.authController.logout);
  }
  getRouter(): Router {
    return this.router;
  }
}
