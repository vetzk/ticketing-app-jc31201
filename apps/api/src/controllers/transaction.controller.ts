import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class TransactionController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTransaction(req: Request, res: Response) {
    const { userId, eventId, qty, discountCode } = req.body;

    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const event = await this.prisma.event.findUnique({ where: { id: eventId } });
      const discount = discountCode ? await this.prisma.discountcode.findFirst({ where: { code: discountCode } }) : null;

      if (!user || !event) {
        return res.status(404).send({ message: 'User or event not found.' });
      }

      let totalPrice = event.price * qty;

      // if (discount) {
      //   totalPrice -= discount.amount.toNumber();
      // }

      if (user.balance < totalPrice) {
        return res.status(400).send({ message: 'Insufficient balance.' });
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { balance: user.balance - totalPrice },
      });

      const transaction = await this.prisma.ticket.create({
        data: {
          userId,
          eventId,
          qty,
          total: totalPrice,
          status: 'PAID',
        },
      });

      res.send(transaction); // Changed to res.send()
    } catch (error) {
      res.status(500).send({ message: 'Failed to process transaction.', error }); // Changed to res.send()
    }
  }

  async readTransaction(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const transaction = await this.prisma.ticket.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!transaction) {
        return res.status(404).send({ message: 'Transaction not found.' });
      }

      res.send(transaction); // Changed to res.send()
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve transaction.', error }); // Changed to res.send()
    }
  }

  async updateTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const { qty, discountCode } = req.body;

    try {
      const transaction = await this.prisma.ticket.findUnique({ where: { id: parseInt(id, 10) } });
      if (!transaction) {
        return res.status(404).send({ message: 'Transaction not found.' });
      }

      const event = await this.prisma.event.findUnique({ where: { id: transaction.eventId } });
      const discount = discountCode ? await this.prisma.discountcode.findFirst({ where: { code: discountCode } }) : null;

      let totalPrice = event!.price * qty;

      // if (discount) {
      //   totalPrice -= discount.amount.toNumber();
      // }

      const updatedTransaction = await this.prisma.ticket.update({
        where: { id: parseInt(id, 10) },
        data: { qty, total: totalPrice },
      });

      res.send(updatedTransaction); // Changed to res.send()
    } catch (error) {
      res.status(500).send({ message: 'Failed to update transaction.', error }); // Changed to res.send()
    }
  }

  async deleteTransaction(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.ticket.delete({
        where: { id: parseInt(id, 10) },
      });

      res.send({ message: 'Transaction deleted successfully.' }); // Changed to res.send()
    } catch (error) {
      res.status(500).send({ message: 'Failed to delete transaction.', error }); // Changed to res.send()
    }
  }
}
