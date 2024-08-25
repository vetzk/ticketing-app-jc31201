import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });
      const discount = discountCode
        ? await this.prisma.discountcode.findFirst({
            where: { code: discountCode },
          })
        : null;

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

      // const transaction = await this.prisma.ticket.create({
      //   data: {
      //     userId,
      //     eventId,
      //     qty,
      //     total: totalPrice,
      //     status: 'PAID',
      //   },
      // });

      // res.send(transaction); // Changed to res.send()
    } catch (error) {
      res
        .status(500)
        .send({ message: 'Failed to process transaction.', error }); // Changed to res.send()
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
      res
        .status(500)
        .send({ message: 'Failed to retrieve transaction.', error }); // Changed to res.send()
    }
  }

  async updateTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const { qty, discountCode } = req.body;

    try {
      const transaction = await this.prisma.ticket.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!transaction) {
        return res.status(404).send({ message: 'Transaction not found.' });
      }

      const event = await this.prisma.event.findUnique({
        where: { id: transaction.eventId },
      });
      const discount = discountCode
        ? await this.prisma.discountcode.findFirst({
            where: { code: discountCode },
          })
        : null;

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
  async addTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.decrypt.id) {
        const { id } = req.query;
        const { qty } = req.body;
        console.log(res.locals.decrypt.id);

        const findUser = await prisma.user.findUnique({
          where: { id: res.locals.decrypt.id },
        });

        if (!findUser) {
          return res.status(404).send({
            success: false,
            message: 'Cannot find user',
          });
        }

        if (!qty) {
          return res.status(401).send({
            success: false,
            message: 'Quantity cannot be empty',
          });
        }

        const findUserEvent = await prisma.event.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!findUserEvent) {
          return res.status(404).send({
            success: false,
            message: 'Cannot find event',
          });
        }

        const orderCode = uuidv4().substring(0, 5);
        let total = qty * findUserEvent?.price;

        const transaction = await prisma.ticket.create({
          data: {
            transactionDate: new Date(),
            eventId: findUserEvent.id,
            userId: findUser?.id,
            orderCode: orderCode,
            qty: qty,
            status: 'UNPAID',
            total: total,
            discountTotal: total,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'successfull to add your transaction',
          result: transaction,
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'cannot find your id',
        });
      }
    } catch (error) {
      console.log(error);
      next({ success: false, message: 'cannot add your transaction', error });
    }
  }

  async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderCode } = req.query;
      if (!orderCode) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find your order code',
        });
      }

      if (typeof orderCode === 'string') {
        const findTransaction = await prisma.ticket.findFirst({
          where: {
            orderCode: orderCode,
          },
          include: {
            event: {
              include: {
                images: true,
              },
            },
          },
        });

        return res.status(200).send({
          success: true,
          message: 'Success to get your transaction',
          result: findTransaction,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid order code',
        });
      }
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot process your transaction',
        error,
      });
    }
  }

  async payTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderCode } = req.body;

      if (!orderCode) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find your order code',
        });
      }

      const findTransaction = await prisma.ticket.findFirst({
        where: {
          orderCode: orderCode,
          userId: res.locals.decrypt.id,
        },
      });

      if (!findTransaction) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find your transaction',
        });
      }

      const payResult = await prisma.ticket.update({
        data: {
          status: 'PAID',
        },
        where: {
          id: findTransaction?.id,
        },
      });

      const transactionDetail = [];
      for (let i = 0; i < payResult.qty; i++) {
        const ticketCode = uuidv4().substring(0, 6).toUpperCase();
        transactionDetail.push({
          ticketId: payResult.id,
          ticketCode: ticketCode,
          status: 'UNUSED',
        });
      }

      await prisma.transactionDetail.createMany({
        data: transactionDetail,
      });

      const findEventAnalytic = await prisma.eventstatistic.findFirst({
        where: {
          eventId: findTransaction.eventId,
        },
      });

      if (!findEventAnalytic) {
        const eventAnalytic = await prisma.eventstatistic.create({
          data: {
            eventId: findTransaction.eventId,
            totalAttendance: payResult.qty,
            totalRevenue: payResult.discountTotal,
            totalTicketsSold: payResult.qty,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'success to pay',
          result: eventAnalytic,
        });
      }

      const sumAttendance = findEventAnalytic.totalAttendance + payResult.qty;
      const sumRevenue =
        findEventAnalytic.totalRevenue + payResult.discountTotal;
      const sumTicket = findEventAnalytic.totalTicketsSold + payResult.qty;
      const updateStat = await prisma.eventstatistic.update({
        data: {
          totalAttendance: sumAttendance,
          totalRevenue: sumRevenue,
          totalTicketsSold: sumTicket,
        },
        where: {
          id: findEventAnalytic.id,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'payment successfull return to the home',
        result: payResult,
        statistic: updateStat,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async pointPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderCode } = req.query;
      if (!res.locals.decrypt.id) {
        return res.status(404).send({
          success: false,
          message: 'cannot get your points, please login',
        });
      }

      const point = await prisma.user.findUnique({
        where: {
          id: res.locals.decrypt.id,
        },
      });

      if (!point || point.points == null) {
        return res.status(404).send({
          success: false,
          message: 'You do not have any points',
        });
      }

      if (typeof orderCode === 'string') {
        const findTicket = await prisma.ticket.findFirst({
          where: {
            orderCode: orderCode,
          },
        });

        if (!findTicket) {
          return res.status(404).send({
            success: false,
            message: 'cannot find your transaction',
          });
        }

        let totalPrice = findTicket?.total - point.points;

        const updatePoint = await prisma.user.update({
          data: {
            points: 0,
          },
          where: {
            id: res.locals.decrypt.id,
          },
        });

        const updatePrice = await prisma.ticket.update({
          data: {
            discountTotal: totalPrice,
          },
          where: {
            id: findTicket.id,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'success to use your points',
          result: updatePrice,
        });
      }
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot use your points',
        error,
      });
    }
  }

  async discountPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderCode } = req.query;
      const { discountcode } = req.body;

      if (!res.locals.decrypt.id) {
        return res.status(404).send({
          success: false,
          message: 'Cannot get your discount voucher, please login',
        });
      }

      const findVoucher = await prisma.discountcode.findFirst({
        where: {
          code: discountcode,
        },
      });

      if (
        !findVoucher ||
        findVoucher.limit === 0 ||
        findVoucher.codeStatus === 'USED'
      ) {
        return res.status(404).send({
          success: false,
          message: 'cannot find your voucher',
        });
      }

      if (typeof orderCode === 'string') {
        const findPrice = await prisma.ticket.findFirst({
          where: {
            orderCode: orderCode,
          },
        });

        if (!findPrice) {
          return res.status(404).send({
            success: false,
            message: 'Cannot find the total amount',
          });
        }

        await prisma.discountcode.update({
          where: {
            id: findVoucher.id,
          },
          data: {
            limit: 0,
            codeStatus: 'USED',
          },
        });

        const totalPrice = (findVoucher.amount / 100) * findPrice.total;
        const totalFinal = findPrice.total - totalPrice;

        const updatePrice = await prisma.ticket.update({
          data: {
            discountTotal: totalFinal,
          },
          where: {
            id: findPrice.id,
          },
        });
        return res.status(200).send({
          success: false,
          message: 'Discount Code used',
          result: updatePrice,
        });
      }
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot add your discount voucher',
        error,
      });
    }
  }

  async getHistoryTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.decrypt.id) {
        return res.status(404).send({
          success: false,
          message: 'cannot find your token',
        });
      }

      const history = await prisma.ticket.findMany({
        where: {
          userId: res.locals.decrypt.id,
        },
        include: {
          event: {
            include: {
              images: true,
            },
          },
        },
      });

      return res.status(200).send({
        success: true,
        message: 'History success fetched',
        result: history,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'cannot get your history transaction',
      });
    }
  }
}
