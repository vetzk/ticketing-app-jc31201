import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class PromotionController {
  async createPromotion(req: Request, res: Response) {
    const { eventId, seats, discount, validFrom, validTo } = req.body;

    try {
      const promotion = await prisma.promotion.create({
        data: {
          eventId,
          seats,
          discount,
          validFrom: new Date(validFrom),
          validTo: new Date(validTo),
        },
      });

      res.send(promotion); // Using res.send() to send the response
    } catch (error) {
      res.status(500).send({ message: 'Failed to create promotion.', error });
    }
  }

  async getPromotion(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const promotion = await prisma.promotion.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!promotion) {
        return res.status(404).send({ message: 'Promotion not found.' });
      }

      res.send(promotion); // Using res.send() to send the response
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve promotion.', error });
    }
  }

  async updatePromotion(req: Request, res: Response) {
    const { id } = req.params;
    const { seats, discount, validFrom, validTo } = req.body;

    try {
      const promotion = await prisma.promotion.update({
        where: { id: parseInt(id, 10) },
        data: { seats, discount, validFrom: new Date(validFrom), validTo: new Date(validTo) },
      });

      res.send(promotion); // Using res.send() to send the response
    } catch (error) {
      res.status(500).send({ message: 'Failed to update promotion.', error });
    }
  }

  async deletePromotion(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.promotion.delete({
        where: { id: parseInt(id, 10) },
      });

      res.send({ message: 'Promotion deleted successfully.' }); // Using res.send() to send the response
    } catch (error) {
      res.status(500).send({ message: 'Failed to delete promotion.', error });
    }
  }

  async applyPromotion(req: Request, res: Response) {
    const { eventId, userId, promoId } = req.body;

    try {
      const promotion = await prisma.promotion.findFirst({
        where: {
          id: promoId,
          eventId,
          validFrom: { lte: new Date() },
          validTo: { gte: new Date() },
        },
      });

      if (!promotion) {
        return res.status(400).send({ message: 'No valid promotion available for this event.' });
      }

      const seatsAvailable = promotion.seats > 0;

      if (!seatsAvailable) {
        return res.status(400).send({ message: 'No seats available for this promotion.' });
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) {
        return res.status(404).send({ message: 'Event not found.' });
      }

      const discountedPrice = event.price - promotion.discount;

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user!.balance < discountedPrice) {
        return res.status(400).send({ message: 'Insufficient balance.' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: user!.balance - discountedPrice },
      });

      await prisma.promotion.update({
        where: { id: promotion.id },
        data: { seats: promotion.seats - 1 },
      });

      res.send({ message: 'Promotion applied successfully.', updatedUser }); // Using res.send() to send the response
    } catch (error) {
      res.status(500).send({ message: 'Failed to apply promotion.', error });
    }
  }
}


//   post example json.body  
//   discount like a coin / price / voucerCode cut price eventId 
// {
//   "eventId": 1,
//   "seats": 50,
//   "discount": 20,
//   "validFrom": "2024-08-01T00:00:00.000Z",
//   "validTo": "2024-08-31T23:59:59.000Z"
// }

// user apply promo to event 
// { 
//   "eventId": 1,
//   "userId": 1, 
//   "promoId": 2 
// }

