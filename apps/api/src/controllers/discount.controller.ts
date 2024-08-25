
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class DiscountController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDiscount(req: Request, res: Response) {
    const { code, amount, validFrom, validTo, limit, codeStatus } = req.body;

    try {
      const newDiscount = await this.prisma.discountcode.create({
        data: { code, amount, validFrom: new Date(validFrom), validTo: new Date(validTo), limit, codeStatus },
      });

      res.json(newDiscount);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create discount code.', error });
    }
  }

  async readDiscount(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const discount = await this.prisma.discountcode.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!discount) {
        return res.status(404).json({ message: 'Discount not found.' });
      }

      res.json(discount);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve discount code.', error });
    }
  }

  async updateDiscount(req: Request, res: Response) {
    const { id } = req.params;
    const { code, amount, validFrom, validTo, limit, codeStatus } = req.body;

    try {
      const discount = await this.prisma.discountcode.update({
        where: { id: parseInt(id, 10) },
        data: { code, amount, validFrom: new Date(validFrom), validTo: new Date(validTo), limit, codeStatus },
      });

      res.json(discount);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update discount code.', error });
    }
  }

  async deleteDiscount(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.discountcode.delete({
        where: { id: parseInt(id, 10) },
      });

      res.json({ message: 'Discount code deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete discount code.', error });
    }
  }
}
