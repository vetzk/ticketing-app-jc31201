import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { eventId, amount, method, status, voucherApplied, discountAmount } = req.body;

    const payment = await prisma.payment.create({
      data: {
        eventId,
        amount,
        method,
        status,
        voucherApplied,
        discountAmount,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const getPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payment' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
};
