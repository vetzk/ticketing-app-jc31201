import prisma from '../prisma';
import { NextFunction, Request, Response } from 'express';

export class VoucherController {
  async getVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.decrypt.id) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find your account',
        });
      }

      const findVoucher = await prisma.discountusage.findFirst({
        where: {
          userId: res.locals.decrypt.id,
        },
      });

      const findDiscount = await prisma.discountcode.findFirst({
        where: {
          id: findVoucher?.id,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'success to get your voucher',
        result: findDiscount,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot get your voucher',
        error,
      });
    }
  }
}
