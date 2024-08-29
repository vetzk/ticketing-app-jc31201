import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('format email is wrong'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage(
      'Password must contain minimum 8 characters, at least one uppercase, one lowercase, one number',
    ),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req);
    if (!errorValidator.isEmpty()) {
      return res.status(400).send({
        success: false,
        error: errorValidator,
      });
    }
    next();
  },
];
