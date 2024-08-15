import prisma from '../prisma';
import { NextFunction, Request, Response } from 'express';

export class TransactionController {
  async addTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.decrypt.id) {
        const { eventId } = req.params;
        const { qty } = req.body;

        const findUser = await prisma.user.findUnique({
          where: { id: res.locals.decrypt.id },
        });

        if (!findUser) {
          return res.status(404).send({
            success: false,
            message: 'Cannot find user',
          });
        }

        const findUserEvent = await prisma.event.findUnique({
          where: {
            id: Number(eventId),
          },
        });

        if (!findUserEvent) {
          return res.status(404).send({
            success: false,
            message: 'Cannot find event',
          });
        }

        const total = qty * findUserEvent?.price;
        await prisma.ticket.create({
          data: {
            transactionDate: new Date(),
            eventId: findUserEvent.id,
            userId: findUser?.id,
            qty: qty,
            status: 'UNPAID',
            total: total,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'successfull to add your transaction',
        });
      }
    } catch (error) {
      console.log(error);
      next({ success: false, message: 'cannot add your transaction', error });
    }
  }

  async payTransaction(req: Request, res: Response, next: NextFunction) {
    const { ticketId } = req.params;

    const payResult = await prisma.ticket.update({
      data: {
        status: 'PAID',
      },
      where: {
        id: Number(ticketId),
      },
    });

    return res.status(200).send({
      success: true,
      message: 'payment successfull return to the home',
      result: payResult,
    });
  }
}
